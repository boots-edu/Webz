#!/usr/bin/env node
const version: string = '0.9.5';

import fs from "fs";
import path from "path";

/**
 * Display the usage of the webz command
 * @returns void
 */
function usage() {
    console.error("Usage: webz <command> <name>");
    console.error("\tWhere command is one of [new, component, dialog]");
    console.error("\tand name is the name of the app or component to create");
    console.error("\tExample: webz new myapp");
    console.error("\tExample: webz component mycomponent");
    console.error("\tExample: webz dialog mydialog");
}

/**
 * Find the .webz.json file above the directory path
 * @param directoryPath The directory path to search above for the .webz.json file
 * @returns boolean
 */
function findWebzConfigFile(directoryPath: string): boolean {
    let currentPath = directoryPath;
    while (currentPath !== "/" && !currentPath.endsWith(":\\")) {
        const configFile = path.join(currentPath, ".webz.json");
        if (fs.existsSync(configFile)) {
            return true;
        }
        currentPath = path.dirname(currentPath);
    }
    return false;
}

/**
 * Copy the scaffold directory to the destination directory replacing template
 * with the app name ######## exact and $$$$$$$$ converted to camel case
 * and @@@@@@@@ converted to lowercase
 * @param src The source directory path
 * @param dest The destination directory path
 * @param appName The name of the app
 * @returns void
 */
function copyDirectory(src: string, dest: string, appName: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    const files = fs.readdirSync(src);

    files.forEach((file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        const stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            copyDirectory(srcPath, destPath, appName);
        } else {
            let fileContent = fs.readFileSync(srcPath, "utf-8");
            fileContent = fileContent.replace(/########/g, appName);
            fileContent = fileContent.replace(
                /@@@@@@@@/g,
                appName.toLowerCase()
            );
            fs.writeFileSync(destPath, fileContent, "utf-8");
        }
    });
}

/**
 * Create a new app with the given name if the directory does not exist
 * @param appName The name of the app to create
 * @returns void
 * @throws Error if the directory already exists
 */
function newApp(appName: string) {
    console.log("Creating a new app: " + appName);
    if (fs.existsSync(appName))
        throw new Error("Directory already exists: " + appName);
    //scaffold the directory
    //copy the scaffold files
    console.log("Copying scaffold files");
    const scaffoldDir = path.join(__dirname, "scaffold");
    copyDirectory(scaffoldDir, appName, appName);
    console.log("Scaffold files copied");
    //cd into directory
    process.chdir(appName);
    //call npm i
    console.log("Installing dependencies");
    const childProcess = require("child_process");
    childProcess.execSync("npm i");
    childProcess.execSync("mv gitignore .gitignore");
    console.log("Dependencies installed");
    console.log("Done");
}

/**
 * Create a new component with the given name if the directory does not exist
 * @param componentName The name of the component to create
 * @param dialog A boolean value indicating whether the component is a dialog
 * @returns void
 * @throws Error if the directory already exists
 */
function createComponent(componentName: string, dialog: boolean) {
    if (
        (!dialog && componentName.endsWith("Component")) ||
        (!dialog && componentName.endsWith("component")) ||
        (dialog && componentName.endsWith("Dialog")) ||
        (dialog && componentName.endsWith("dialog"))
    ) {
        componentName = componentName.substring(
            0,
            componentName.length - (dialog ? 6 : 9)
        );
    }
    if (componentName.endsWith("-")) {
        componentName = componentName.substring(0, componentName.length - 1);
    }
    console.log(
        `Creating a new ${dialog ? "dialog" : "component"}: ${componentName}`
    );
    if (fs.existsSync(componentName))
        throw new Error("Directory already exists: " + componentName);
    // Create the component directory
    fs.mkdirSync(componentName);
    // Read the scaffold directory
    console.log("Copying scaffold files");
    const scaffoldDir = path.join(
        __dirname,
        dialog ? "dialog-scaffold" : "component-scaffold"
    );
    const files = fs.readdirSync(scaffoldDir);
    // Iterate through each file in the scaffold directory
    files.forEach((file) => {
        const srcPath = path.join(scaffoldDir, file);
        const destPath = path.join(
            componentName,
            file.replace(/template/, componentName)
        );
        const stats = fs.statSync(srcPath);
        if (stats.isDirectory()) {
            // If it's a directory, do nothing
        } else {
            // If it's a file, read the file content
            let fileContent = fs.readFileSync(srcPath, "utf-8");
            // Replace ######## with the component name
            fileContent = fileContent.replace(/########/g, componentName);
            // Replace $$$$$$$$ with the camel case of the component name
            const camelCaseName = toCamelCase(componentName);
            fileContent = fileContent.replace(
                /\$\$\$\$\$\$\$\$/g,
                camelCaseName
            );
            // Write the modified file content to the destination path
            fs.writeFileSync(destPath, fileContent, "utf-8");
        }
    });
    console.log("Component scaffold created");
}

/**
 * Convert the name to camel case
 * @param name The name to convert to camel case
 * @returns string
 */
function toCamelCase(name: string) {
    // Convert the name to camel case
    // Implementation of converting name to camel case
    const camelCaseName = name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
    return camelCaseName;
}

/**
 * Run the webz command
 * @returns void
 */
function runProgram() {
    // Provide a title to the process in `ps`.
    // Due to an obscure Mac bug, do not start this title with any symbol.
    try {
        process.title = "webz " + Array.from(process.argv).slice(2).join(" ");
    } catch (_) {
        // If an error happened above, use the most basic title.
        process.title = "webz";
    }

    if (
        process.argv.length !== 4 ||
        !(
            process.argv[2].startsWith("n") ||
            process.argv[2].startsWith("c") ||
            process.argv[2].startsWith("d")
        )
    ) {
        usage();
        process.exit(1);
    }

    try {
        if (process.argv[2].startsWith("n")) {
            newApp(process.argv[3]);
        } else {
            if (findWebzConfigFile(path.dirname(process.cwd())))
                if (process.argv[2].startsWith("c"))
                    createComponent(process.argv[3], false);
                else createComponent(process.argv[3], true);
            else
                console.error(
                    "This command is only valid within the app folder of a webz application created with webz new <appname>"
                );
        }
    } catch (e: any) {
        console.log("Error: " + e.message);
    }
}

// Run the program
console.log(`webz v.${version} is starting...`);
runProgram();
console.log("Finished");
