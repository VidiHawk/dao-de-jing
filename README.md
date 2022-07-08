# Dao de Jing

### Bugs

- Audio sometimes replays twice the same track. This is not happening on all browsers/devices.
- How to reproduce on iPhone 13:
- https://live.browserstack.com/dashboard#os=iOS&os_version=14.0&device_browser=safari&zoom_to_fit=true&full_screen=true&url=http%3A%2F%2Flocalhost%3A3000%2F&speed=1
- click on the play button and wait until the end of the track
- the same track plays again instead of the second track

### Next steps

- add a PWA install button in Settings: https://javascript.plainenglish.io/creating-a-browser-agnostic-pwa-install-button-41039f312fbe 
- SEO https://www.dotcms.com/blog/post/single-page-applications-seo-how-to-get-it-right
- optimize font loading https://microwork.dev/optimize-google-fonts-to-fix-eliminate-render-blocking-issues/. I did convert KaiTi from .ttf to .woff2 with https://transfonter.org/. The file size went from 11MB to 3.8MB, but this is still too much so I deactivated the fonts on the app.

### Golden Ratio

Key design elements of this app are sized according to the golden ratio φ.

### References

https://codepen.io/OlgaKoplik/pen/pXGQNQ

https://codepen.io/rutcoba/pen/jOOGxZz

https://codepen.io/MoritzGiessmann/pen/XWWovQP?html-preprocessor=pug
