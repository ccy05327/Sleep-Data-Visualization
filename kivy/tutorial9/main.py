import kivy
from kivy.app import App
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen


class MainWindow(Screen):
    pass


class SecondWindow(Screen):
    pass


class WindowManager(ScreenManager):
    pass

# load the kv file no matter the name
kv = Builder.load_file("my.kv")


class SDV(App):
    def build(self):
        return kv


if __name__ == '__main__':
    SDV().run()
