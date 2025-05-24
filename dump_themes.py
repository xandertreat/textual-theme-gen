# This script is intended to dump .tcss variables from the built in themes of Textual
# TODO: automate conflict resolving dumping into /src/data/themes.json
from textual.app import App
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


class Dump(App):
    """Textual App to switch through themes and log their CSS variable values."""
    THEMES = [
        "textual-dark",
        "textual-light",
        "nord",
        "gruvbox",
        "catppuccin-mocha",
        "dracula",
        "tokyo-night",
        "monokai",
        "flexoki",
        "catppuccin-latte",
        "solarized-light",
    ]
    SWITCH_INTERVAL = 0.2
    EXIT_DELAY = 0.5

    def on_mount(self) -> None:
        self._theme_index = 0
        self._cycle_themes()

    def _cycle_themes(self) -> None:
        if self._theme_index < len(self.THEMES):
            theme_name = self.THEMES[self._theme_index]
            self.theme = theme_name
            logger.info(f"\n=== Theme: {theme_name} ===")
            self.call_after_refresh(self._dump_theme_variables)
            self._theme_index += 1
            self.set_timer(self.SWITCH_INTERVAL, self._cycle_themes)
        else:
            self.set_timer(self.EXIT_DELAY, self.exit)

    def _dump_theme_variables(self) -> None:
        vars_map = self.get_css_variables()
        for var_name, value in vars_map.items():
            logger.info(f"${var_name}: {value}")


if __name__ == "__main__":
    Dump().run(headless=True)
