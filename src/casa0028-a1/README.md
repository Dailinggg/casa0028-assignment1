London Blue Plaques Explorer

This is a single-page React app for exploring how roles commemorated on London blue plaques change over time. The app separates volume (total plaques per decade) from composition (stacked roles by decade). The controls are designed to test whether a pattern is stable, rather than just making the charts look interactive.

Data
The project uses the Open Plaques London CSV dataset. The charts only include records with a usable year. Many records in the source file have missing or invalid year values, so the results should be read as patterns in the dated subset.

How to explore
Count vs Share helps separate “more plaques recorded” from “different composition”.
Hide “Unknown” is a robustness check for missing labels. In my case it does not change the shapes much.
Top roles controls granularity. From 5 to 8, Others shrinks clearly because mid-sized roles become visible. From 8 to 12, the change is small, suggesting the additional roles are minor and mostly affect detail.

Tech
React + Vite
Chart.js (react-chartjs-2)
PapaParse for CSV parsing

Limitations
Role labels are not perfectly consistent, and year coverage is incomplete. The app includes simple normalisation and an Unknown toggle, but these do not remove all bias in the source data.