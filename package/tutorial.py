from color import *
import time


def tutorial():
    input(RESET+"\tThis is a tool you can visualize your sleep records with python & plotly" +
          GREY+" (press enter to continue)")
    input(RED+"\t\tPlease make sure you have plotly installed before proceeding further" +
          RESET+GREY+" (press enter to continue)"+RESET)

    first_time = input(
        BYELLOW+"\t\tDo you want to see the instructions for using this tool" + RESET+WHITE+" (yes/[no])? "+RESET)
    if first_time == 'Y' or first_time == 'y' or first_time == 'yes' or first_time == 'YES':
        print(RESET+"\t\t"+"="*25+" TUTORIAL "+"="*25)
        input("Here are some instructions to help you use this tool" +
              GREY+" (press enter to continue)"+RESET)
        input("There are two steps involved in the program." +
              GREY+" (press enter to continue)"+RESET)
        input("First you need to write in your data in order to visualize it." +
              GREY+" (press enter to continue)"+RESET)
        input("You will have the option to choose which one you want each time you enter." +
              GREY+" (press enter to continue)"+RESET)
        print("It will look like this...")
        time.sleep(1)
        input("Do you want to "+BBLUE+"write" +
              RESET+WHITE+" or "+BPURPLE+"read"+RESET+WHITE+" file? "+RESET+GREY+" \n(press enter to continue)"+RESET)
        input("You can enter 'Write, write, or w' for "+BBLUE+"write" + RESET+", and 'Read, read, or r' for "+BPURPLE+"read "
              + RESET+GREY+" (press enter to continue)"+RESET)
        input("If this is your first time using this tool, it is recommended to enter a few records before you start reading and visualizing the file. (At least one record required)."
              + RESET+GREY+" (press enter to continue)"+RESET)
        input("Type w and then it will prompt you the records for you to enter." +
              RESET+GREY+" (press enter to continue)"+RESET)
        input("    An exampe of a sleep record will be: " +
              "\n\tFebruary 1st 23:39 to February 2nd 07:24" +
              "\n\t2 (enter)  1 (enter) 23 (enter) 39 (enter) 23 (enter) 59 (enter) 7.75 (enter)" +
              GREY+"\n\t Enter another record after this one is done  " +
              "\n\tRepeat the process of running the file and choosing 'w' " + RESET +
              "\n\t2 (enter) 2 (enter) 0 (enter) 0 (enter) 7 (enter) 24 (enter) 7.75 (enter)" +
              GREY+" (press enter to continue)\n"+RESET)
        input("" +
              RESET+GREY+" (press enter to continue)"+RESET)
        input("" +
              RESET+GREY+" (press enter to continue)"+RESET)
        input("" +
              RESET+GREY+" (press enter to continue)"+RESET)
