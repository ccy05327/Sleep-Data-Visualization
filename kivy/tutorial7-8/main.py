import kivy
from kivy.app import App
from kivy.uix.widget import Widget
from kivy.graphics import Rectangle
from kivy.graphics import Color
from kivy.graphics import Line


class Touch(Widget):
    def __init__(self, **kwargs):
        super(Touch, self).__init__(**kwargs)

        with self.canvas:
            Color(1, 1, 0, 0.5, mode='rgba')
            Line(points=(20, 30, 400, 500, 60, 500))
            Color(1, 0, 0, 0.5, mode='rgba')
            self.rect = Rectangle(pos=(0, 0), size=(100, 100))
            # self.rect = Rectangle(pos=(200, 300), size=(300, 200))

    def on_touch_down(self, touch):
        self.rect.pos = touch.pos
        print("Mouse Down", touch)
        # self.btn.opacity = 0.5

    def on_touch_move(self, touch):
        self.rect.pos = touch.pos
        print("Mouse Move", touch)

    def on_touch_up(self, touch):
        print("Mouse Up", touch)
        # self.btn.opacity = 1


class SDV(App):
    def build(self):
        return Touch()


if __name__ == '__main__':
    SDV().run()
