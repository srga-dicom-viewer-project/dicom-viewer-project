# dicom-viewer-project

## Kanban Board
https://trello.com/b/XyImPIjY/kanban-board

## How to install
1. Clone the repository into a directory
2. In that directory run `npm install --force`
3. Fill out the required fields in the .env
    - For LeadTools you will need to register a license and download it
    - For `REACT_APP_LEADTOOLS_LICENSE` convert the contents of `LICENSE.lic` into one line without any new line characters and put it into the field as a string
    - For `REACT_APP_LEADTOOLS_DEVELOPER_KEY` put the contents of `license.lic.key` from your license into the field as a string
    - For the AWS fields you can follow [this](https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/) tutorial which walks you through how to create an AWS bucket and add access for the application
4. Place the required Leadtools libraries in the `client/src/viewer/leadtools/lib` directory
    - You'll need these files:
      * Leadtools.js
      * Leadtools.Controls.js
      * Leadtools.Annotations.Engine.js
      * Leadtools.Annotations.Designers.js
      * Leadtools.Annotations.Rendering.JavaScript.js
      * Leadtools.Annotations.Automation.js
      * Leadtools.Controls.Medical.js
5. If you are not using the default port you will have to change that in `client/index.html`
6. Then run `npm run build`
7. And finally `npm run start`

## How to develop
1. Do steps above for how to install
2. Then run `npm run dev`