import sys
import json
import tempfile
import base64
import pandas as pd
import plotly.express as px
import plotly.io as pio
import plotly.graph_objects as go

single_width: int = 20  # width for each bar

IMAGE_WIDTH = 900

# pio.kaleido.scope.default_format = "png"  # Set default format to PNG


def draw_save(_df: pd.DataFrame, _file: str, display_days: int) -> None:
    '''
    Read a file and a DataFrame, produce and save a timeline chart.

    _df -- DataFrame containing the data.

    _file -- file name to save the image to.

    return -- nothing.
    '''

    _df["Sleep"] = pd.to_datetime(_df["Sleep"])
    _df["Wake"] = pd.to_datetime(_df["Wake"])
    _df["Label"] = _df["Date"] + " " + _df.index.astype(str)
    _df["DurationStr"] = _df["Duration"].astype(str)

    height = max(single_width * display_days, 100)

    # fig = px.timeline(_df,
    #   color = "Duration",
    #   x_start = "Sleep",
    #   x_end = "Wake",
    #   y = "Date",
    #   color_continuous_scale = [
    #       '#ffff3f', '#52b69a', '#0077b6'],
    #   width = IMAGE_WIDTH, height = max(
    #       single_width * display_days, 100)
    #   )

    fig = go.Figure()

    for idx, row in _df.iterrows():
        fig.add_trace(go.Bar(
            x=[(row["Wake"] - row["Sleep"]).total_seconds() / 3600],
            y=[row["Label"]],
            orientation='h',
            name=row["DurationStr"] + " hrs",
            hovertext=f'{row["Sleep"]} → {row["Wake"]}',
            marker=dict(color=row["Duration"],
                        colorscale='Viridis', showscale=False)
        ))

    fig.update_layout(
        width=IMAGE_WIDTH,
        height=height,
        title="Sleep Timeline",
        xaxis_title="Hours",
        yaxis_title="Date",
        barmode='stack',
        margin=dict(l=100, r=30, t=30, b=30),
    )

    print(_df.dtypes, file=sys.stderr)
    print(_df.head(), file=sys.stderr)

    fig.update_yaxes(autorange="reversed")

    # pio.write_image(fig, _file)
    img_bytes = pio.to_image(fig, format="png")
    with open(_file, "wb") as f:
        f.write(img_bytes)


if __name__ == "__main__":
    payload = json.load(sys.stdin)  # blocking read
    rows = payload["rows"]
    display = payload.get("display", 30)

    # Create a DataFrame from the rows
    # Assume fields: Date, Sleep, Wake, Duration
    df = pd.DataFrame(rows[-display:])

    # Create temporary PNG file
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
        temp_path = temp_file.name
    draw_save(df, temp_path, display)

    # Read the PNG file and encode it as base64
    with open(temp_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

    # Send JSON response to the caller
    json.dump({"ok": True, "png": encoded_string}, sys.stdout)

    # with open("out.json") as f:
    #     encoded = json.load(f)["png"]

    # with open("preview.png", "wb") as f:
    #     f.write(base64.b64decode(encoded))
