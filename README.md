## Project Title
Travelytics

## Group Members
Alex Chen, Daniel Shi, Carter Jones, Ayden Badyal


## Brief Description
Travelytics is a travel guide web application that allows users to explore countries. Travelytics provides information about the specific country, such as time zone, 5-day weather forecast, general information, and country flag.

## What This Project Was Made With 
Travelytics was built using Next.js, Shadcn, GeoNamesAPI and OpenWeatherAPI.

##  Project Feedback Form
[Link to Feedback Form](https://docs.google.com/forms/d/1XZk8IoOraZ1cLlg-FjbrqMqVwN33C6jESV8F_CJ-lV0/edit)

## How to Deploy Locally
>NOTE: The following steps assume you have `git`, `node.js` and any interactive development environment, like Visual Studio Code installed on your local machine.
>You can download these tools with the following links and follow the instructions on the respective websites to learn how to install them (make sure to install the correct executable for your operating system!):
>
>node.js: https://nodejs.org/en/download
>
>git: https://git-scm.com/downloads
>
> Visual Studio Code: https://code.visualstudio.com/download
>
>In addition, these instructions also assume that you have downloaded the `.env.local` file provided by our submission on Canvas. To open the provided `.env.local` file, navigate to the folder you saved the `.env.local` file to in your file explorer. Double-click the newly downloaded `.env.local`. You may be prompted with the following popup that says: "Select an app to open this `.download` file". If this shows up, select your web browser such as Google Chrome and select "Just Once". You may also open the file with a text editor, such as Notepad or Notes. Once the file opens, you should see two lines, which are meant to be copied and pasted into the `.env.local` file in the root of our repository which you will be cloning to host locally, which is explained in the steps below.
1) Clone this repository by clicking the green `Code` button. Select either HTTPS or SSH, depending on the connection used on your local machine and click the copy button next to the link. To find out if you are using an SSH connection, type `ssh -T git@github.com` in any terminal. If there is output such as "Hi `username`! You've successfully authenticated, but GitHub does not provide shell access." then you are using SSH, and if not then you will need to clone using HTTPS. 
2) Launch a terminal. Then, in the terminal, navigate to a directory that you want to clone the project in using `cd <path>`, where `path` is a desired folder.
4) In the terminal, type `git clone` followed by space and then press `cntrl-v` (paste) to paste the github repository URL. 
5) Navigate to the project using `cd final-project-1-sky`
6) In the project root, run `npm install` to install all necessary packages.
> HINT: root is the base folder, i.e. `final-project-1-sky` should be the last folder name to be displayed on the terminal like so: `/../../final-project-1-sky`
8) Create a file called `.env.local` in the root folder for API keys. On the first two lines of the `.env.local` file, you will need to input two variables and ensure that both variable names are stacked (i.e. their names should be one on top of another, one on line 1, and another on line 2). The variable names are the following for the APIs:
`OPENWEATHER_API_KEY` for <strong>OpenWeatherAPI</strong>, and `GEONAMES_USERNAME` for <strong>GeoNamesAPI</strong>. Copy and paste the corresponding keys from the downloaded `.env.local`. This is important! Then, save the file by pressing `cntrl+s`.
9) run `npm run dev` in the terminal and open the localhost link that is provided in the terminal (usually named localhost:3000) to run the application locally.

## Links to Project Website, Reports, and Videos
[Group 1 Sky M1 Presentation](https://youtu.be/OFFBTig6KWY)

[Group 1 Sky M1 Report](./docs/reports/CMPT276_Group1_Sky_M1_Report.pdf)

[Group 1 Sky Final Presentation](https://youtu.be/gSQlN4Iacw0)

[Group 1 Sky Final Project Website](https://travelytics276.vercel.app/)

[Group 1 Sky Final Report](./docs/reports/CMPT276_Group1_Sky_M2_Final_Report.pdf)
