from color import *
from helper import *
from tutorial import *
from write import *
from read_draw import *

# INSTALL REQUIRED PACKAGES
install('plotly')

# OPTION TO SKIP TUTORIAL
toSkip = input(RESET+"\t\tWelcome to the Sleep Data Visualization Tool" +
               GREY+" (skip/enter to continue) "+RESET)

# INSTRUCTIONS
if toSkip != 'skip' and toSkip != 'SKIP' and toSkip != 'Skip':
    tutorial()

write_or_read = input("Do you want to "+BBLUE+"write" +
                      RESET+WHITE+" or "+BPURPLE+"read"+RESET+WHITE+" file? ")
# WRITE RECORD
if write_or_read == "Write" or write_or_read == "write" or write_or_read == "w":
    write()

# READ and/or DRAW FILE/RECORD
if write_or_read == "Read" or write_or_read == "read" or write_or_read == "r":
    read_draw()
