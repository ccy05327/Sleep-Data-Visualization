import plotly.express as px
import plotly.io as pio
import pandas as pd
from datetime import datetime, timedelta
import json
import sys
import os
import base64


def normalize_virtual_range(sleep_dt, wake_dt):
    base = datetime(2025, 4, 1)

    virtual_sleep = sleep_dt.apply(lambda d: base.replace(
        hour=d.hour, minute=d.minute, second=0))
    virtual_wake = wake_dt.apply(lambda d: base.replace(
        hour=d.hour, minute=d.minute, second=0))

    # ✅ If wake is earlier than sleep (cross-midnight), shift wake by 1 day
    virtual_wake = virtual_wake.where(
        virtual_wake > virtual_sleep, virtual_wake + timedelta(days=1))

    return virtual_sleep, virtual_wake


def draw_save(_df: pd.DataFrame, _file: str, display_days: int):
    _df["Sleep"] = pd.to_datetime(_df["Sleep"])
    _df["Wake"] = pd.to_datetime(_df["Wake"])
    _df = _df.sort_values("Sleep").reset_index(drop=True)

    def format_date(d):
        return d.strftime("%#d %b") if sys.platform == "win32" else d.strftime("%-d %b")

    rows = []

    for _, row in _df.iterrows():
        sleep = row["Sleep"]
        wake = row["Wake"]
        duration = row["Duration"]

        base_day = datetime(2025, 4, 1)
        start = base_day.replace(
            hour=sleep.hour, minute=sleep.minute, second=0)
        end = base_day.replace(hour=wake.hour, minute=wake.minute, second=0)

        if end <= start:
            # Cross-midnight: split into two bars
            rows.append({
                "Date": format_date(sleep.date()),
                "Sleep": start,
                "Wake": base_day.replace(hour=23, minute=59, second=59),
                "Duration": duration
            })
            rows.append({
                "Date": format_date(wake.date()),  # assign next day's label
                "Sleep": base_day.replace(hour=0, minute=0),
                "Wake": end,
                "Duration": duration
            })
        else:
            rows.append({
                "Date": format_date(sleep.date()),
                "Sleep": start,
                "Wake": end,
                "Duration": duration
            })

    chart_df = pd.DataFrame(rows)

    fig = px.timeline(
        chart_df,
        x_start="Sleep",
        x_end="Wake",
        y="Date",
        color="Duration",
        color_continuous_scale="YlGnBu",
        title="Sleep Time Visualisation",
        hover_data={"Duration": True}
    )

    fig.update_yaxes(autorange="reversed")
    fig.update_layout(
        width=900,
        height=max(20 * len(chart_df), 100),
        margin=dict(l=100, r=30, t=40, b=30),
        xaxis=dict(
            range=[
                datetime(2025, 4, 1, 0, 0),
                datetime(2025, 4, 2, 0, 0)
            ],
            tickformat="%H:%M",
            title="Time of Day"
        ),
        coloraxis_colorbar=dict(title="hours")
    )

    # Use path from command-line argument if provided, else default to ./out.png
    if len(sys.argv) > 1:
        _file = os.path.abspath(sys.argv[-1])
    else:
        _file = os.path.abspath(os.path.join(
            os.path.dirname(__file__), '..', 'data', 'out.png'))

    img_bytes = pio.to_image(fig, format="png")
    with open(_file, "wb") as f:
        f.write(img_bytes)


if __name__ == "__main__":
    payload = json.load(sys.stdin)
    rows = payload["rows"]
    display = payload.get("display", 30)

    df = pd.DataFrame(rows[-display:])

    try:
        draw_save(df, "data/out.png", display)
        # ✅ Output clean JSON
        json.dump({"ok": True, "png": base64.b64encode(
            open("data/out.png", "rb").read()).decode()}, sys.stdout)
    except Exception as e:
        # ✅ Output error as JSON
        json.dump({"ok": False, "error": str(e)}, sys.stdout)
