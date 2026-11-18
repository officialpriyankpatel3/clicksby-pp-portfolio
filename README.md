# clicksby.pp | Priyank Patel Photography

3D animated photography portfolio (HTML + CSS + JavaScript + Three.js). No build step needed.

## Go live with GitHub Pages
1. Open this repository on GitHub, then **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/ (root)**, then click **Save**.
4. After 1 to 2 minutes the site is live at `https://<your-username>.github.io/clicksby-pp-portfolio/`.

## Add your own photos
Open `script.js` and edit the `PHOTOS` list at the top. For each photo, put your image path and a title:

```js
{ src: 'photos/wedding-01.jpg', title: 'Wedding' }
```

Upload your images into a `photos/` folder in this repo (Add file → Upload files). Portrait photos (3:4) look best. Keep each image under about 500 KB so the site loads fast.

The current photos are random placeholders from picsum.photos.

## Change contact details
Open `index.html`, find the `contact` section and update:
- Instagram link
- WhatsApp number (`91XXXXXXXXXX`)
- Email (`your-email@example.com`)
