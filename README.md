# lucidfx

Target market:
    - Your average classic footage enthusiast who wants to see buddy rich in 4k!
    - Maybe they have a niche they are also interested in!
    - They want to contribute to the body of upscaled content!
    
Competitors: https://www.media.io/

Target market: people without specialist machine learning hardware who are interested
in photo/video AI enhancement and misc AI tools.

Pay as you go model based on cost to run algos.
Significant discount for monthly subscription.

Sales Copy:
-----------
Giving you access to powerful state of the art machine learning hardware and
algorithms. Only pay for what you use!

Stack:
------
T3 full stack- Deployed to railway
Backend: Use ML as a service providers - Deployed to replicate
Cloud Storage on GCP
Postgres database on GCP
Domain name hosted on GCP
CI: GitHub Actions

Key challenges:
---------------
Upload AI models to replicate.
Give access to AI models on payg and have a monthly membership discount.
Ship app to iOS, Android, Browser.

- Dewatermark photo (charge per photo)
- Dewatermark vid (charge per photo)
- tranformer based photo upscale (charge by photo)
- 4K vid upscale (charge per min of vid)
- framerate increase (charge per min of vid)
- ...
- Etc (for lots of AI video upscales)

Give AI photo/video editing tools that require state of the art AI to build
and make it accessible to anyone.


Eventually:
-----------
Extend to generate content ecosystem (including twitter posts, instagram reels
youtube shorts etc)
    - High engagement content (whisper voice ai to generate in your face captions).
    - Overlay generic high engagement content with your content.
    - Anything else I feel would have value.
