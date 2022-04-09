import kivy
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.widget import Widget
from kivy.properties import ObjectProperty


class Grid(Widget):
    sleepH = ObjectProperty(None)
    sleepM = ObjectProperty(None)
    wakeH = ObjectProperty(None)
    wakeM = ObjectProperty(None)

    def btn(self):
        print("Sleep: {}:{}, Wake: {}:{}".format(self.sleepH.text, self.sleepM.text, self.wakeH.text, self.wakeM.text))
        self.sleepH.text = ""
        self.sleepM.text = ""
        self.wakeH.text = ""
        self.wakeM.text = ""
# create the layout with just python
# other version, same content using pure kv
# class Grid(GridLayout):
#     def __init__(self, **kwargs):
#         super(Grid, self).__init__(**kwargs)
#         self.cols = 1

#         # The Grid layout that contains the inputs
#         # to sepate it from the button
#         self.inside = GridLayout()
#         self.inside.cols = 2

#         # Sleep Hour label & input
#         self.inside.add_widget(Label(text="Sleep Hour: "))
#         self.sleepH = TextInput(multiline=False)
#         self.inside.add_widget(self.sleepH)

#         # Sleep Minute label & input
#         self.inside.add_widget(Label(text="Sleep Minute: "))
#         self.sleepM = TextInput(multiline=False)
#         self.inside.add_widget(self.sleepM)

#         # Wake Hour label & input
#         self.inside.add_widget(Label(text="Wake Hour: "))
#         self.wakeH = TextInput(multiline=False)
#         self.inside.add_widget(self.wakeH)

#         # Wake Minute label & input
#         self.inside.add_widget(Label(text="Wake Minute: "))
#         self.wakeM = TextInput(multiline=False)
#         self.inside.add_widget(self.wakeM)

#         self.add_widget(self.inside)

#         # Submit button & label
#         self.submit = Button(text="Submit", font_size=32)
#         # Action when button pressed
#         self.submit.bind(on_press=self.pressed)
#         self.add_widget(self.submit)
        
#     def pressed(self, instance):
#         sleepH = self.sleepH.text
#         sleepM = self.sleepM.text
#         wakeH = self.wakeH.text
#         wakeM = self.wakeM.text
        
#         # print out the inputs
#         print("Sleep: {}:{}, Wake: {}:{}".format(sleepH, sleepM, wakeH, wakeM))
#         # clear out all the inputs
        # self.sleepH.text = ""; self.sleepM.text = ""; self.wakeH.text = ""; self.wakeM.text = ""


class SDV(App):
    def build(self):
        # return Label(text="Sleep Data Visualization")
        return Grid()


if __name__ == '__main__':
    SDV().run()
