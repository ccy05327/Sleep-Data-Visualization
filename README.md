# Ideas for SDV Desktop App

- Display how many records they are after input

- User input \_\_ days of past records to view (max 30)

- Rewrite records? how

-


# Instruction

- Input Validation

    - Non-integer -> not work

    - Invalid range -> absolute value + modulo to valid range

    - Days are 31 days

    - Years are 2022 onwards

- Steps

    - Enter year, month, day, sleep hour, sleep minute, wake hour, wake minute

    - If sleep and awake is not the same day, enter separately
    
        - Enter the first day's wake hour 23 and wake minute 59

        - Enter the second day's sleep hour 0 and sleep minute 0