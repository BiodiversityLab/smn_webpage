# ASV card backup (before visual refresh)

This file stores the previous ASV card HTML and CSS for rollback reference.
Saved on 2026-03-20.

## HTML snippet (`index.html`)

```html
<div class="hero-card reveal">
    <div class="glass-card">
        <h2 id="asv-uploading">Uploading ASV data to a global database</h2>
        <p>
            Explore and share DNA sequences and species occurrences derived from metabarcoding (eDNA)
            studies.
        </p>

        <div class="asv-advantages" aria-label="Advantages of uploading data to ASV Portal">
            <h3>Advantages of uploading your data to the ASV Portal</h3>
            <ol>
                <li><strong>Visibility</strong><span>Increase the visibility and citation of your work. Each dataset receives a stable GBIF DOI that makes your data citable and traceable in scientific publications.</span></li>
                <li><strong>FAIR Data</strong><span>Make your ASVs Findable, Accessible, Interoperable and Reusable. The portal ensures consistent metadata, open formats and long-term accessibility.</span></li>
                <li><strong>Up to date</strong><span>Your ASVs are automatically re-annotated using the latest reference databases. This keeps your taxonomic assignments current without additional work on your side.</span></li>
                <li><strong>Insight and comparison</strong><span>Compare your results with other metabarcoding datasets. The portal enables cross-study analyses and helps you identify broader biodiversity patterns.</span></li>
                <li><strong>Contribute to global knowledge</strong><span>By uploading your ASVs, you support national and international biodiversity research and help build a comprehensive picture of species distributions.</span></li>
            </ol>
        </div>

        <div class="asv-video-guide" aria-label="Video guide for uploading ASV data">
            <h3>How to upload ASV data (video guide)</h3>

            <div class="asv-media-actions" aria-label="Upload tutorial and support actions">
                <div class="asv-video-frame">
                    <iframe
                            src="https://www.youtube.com/embed/a9ABLK0OzjU?autoplay=1&mute=1&playsinline=1&rel=0"
                            title="How to upload ASV data to the ASV Portal"
                            loading="lazy"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen>
                    </iframe>
                </div>

                <div class="asv-action-stack">
                    <a class="btn btn-primary btn-wide asv-slides-button" href="files/Uploading_Data_on_ASV.pdf"
                       download="Uploading_Data_on_ASV.pdf">
                        Download slides from the video
                    </a>

                    <a class="btn btn-primary btn-wide" href="https://asv-portal.biodiversitydata.se/"
                       target="_blank" rel="noopener noreferrer">
                        Open ASV portal
                    </a>

                    <a class="btn btn-primary btn-wide asv-help-button" href="#contact">Request help with uploading data on the ASV portal</a>
                </div>
            </div>
        </div>
    </div>
</div>
```

## CSS snippet (`styles.css`)

```css
.hero h1{
  margin: 16px 0 10px;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-card .glass-card{
  border-radius: var(--radius-lg);
  border: 1px solid var(--panel-border);
  background: var(--panel-bg);
  box-shadow: var(--shadow);
  padding: 18px;
  position: relative;
  top: 0;
}

.asv-advantages{
  margin: 14px 0;
}
.asv-advantages h3{
  margin: 0 0 10px;
  font-size: 1rem;
  letter-spacing: -0.01em;
}
.asv-advantages ol{
  margin: 0;
  padding-left: 20px;
  color: var(--muted);
  display: grid;
  gap: 10px;
}
.asv-advantages li strong{
  display: block;
  margin-bottom: 4px;
  color: var(--text);
}
.asv-advantages li span{
  display: block;
}

.asv-video-guide{
  margin-top: 14px;
  display: grid;
  gap: 10px;
}
.asv-video-guide h3{
  margin: 0;
  font-size: 1rem;
  letter-spacing: -0.01em;
}
.asv-media-actions{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: start;
}
.asv-video-frame{
  aspect-ratio: 16 / 9;
  min-height: 140px;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}
.asv-video-frame iframe{
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
.asv-action-stack{
  display: grid;
  gap: 10px;
  align-content: start;
}
.asv-slides-button{
  margin-top: 0;
}
.asv-help-button{
  margin-top: 0;
}
```
