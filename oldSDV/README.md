## Instruction

- Input Validation
    - Validate based on field type (i.e. month, hour, duration)
    - Duration [optional]
        - filled: use the value
        - not filled: calculate based on sleep and wake
        Will need to exclude some woke-up-in-between time sometimes

- Steps
    - Enter year, month, day, sleep hour, sleep minute, wake hour, wake minute, duration [optional]
    - If sleep and awake is not the same day, enter separately
        - Enter the first day's wake hour 23 and wake minute 59
        - Enter the second day's sleep hour 0 and sleep minute 0
    
- Methods
    - write in to both SQL database & JSON file
    - read from SQL database & draw the graph

## Further thoughts

- stay with local database for now
- improve & simplify input validation
- change to enter date (year/month/day), sleep (hour, minute), wake (hour, minute), duration [optional] not sure if better
- each row a bit more flexible
- [crazy thought] modifiable GUI table to modify the data & view in pages
- [continuous thought] combined with Dash (failed before)
