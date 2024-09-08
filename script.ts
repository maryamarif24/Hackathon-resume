

// Function to load a SCSS or CSS file dynamically into the document's head
function load_template_scss_assets(src: string) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = src;

    document.head.appendChild(linkElement);
}

// Function to load a SCSS or CSS file and insert it before an existing CSS file in the document's head
function load_template_scss(src: string) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = src;

    // Select the element where we want to insert the new stylesheet before
    const cssColor = document.querySelector(".minihub-color-theme-css");
    
    if (cssColor) {
        cssColor.insertAdjacentElement("beforebegin", linkElement);
    } else {
        console.warn("No element with class '.minihub-color-theme-css' found. Appending to head.");
        document.head.appendChild(linkElement);
    }
}

// Function to load a dynamic JavaScript file asynchronously
function loadDynamicScriptFileAsync(src: string, async: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const scriptElement = document.createElement("script");
            scriptElement.src = src;
            scriptElement.async = async;

            scriptElement.onload = () => resolve();
            scriptElement.onerror = (error) => reject(new Error(`Failed to load script: ${src}`));

            // Insert the script element before the first script tag in the document
            const firstScript = document.getElementsByTagName("script")[0];
            if (firstScript) {
                firstScript.parentNode?.insertBefore(scriptElement, firstScript);
            } else {
                document.body.appendChild(scriptElement); // In case no script tags are present
            }
        } catch (error) {
            reject(error);
        }
    });
}

// Function to initialize metrics for the page
function InitializeMetricsForPage(portalCD: string, productCD: string, config: any = { useDevJs: false }): Promise<void[]> {
    // Setting default values for script URLs
    const commonScriptsUrl = config.commonScriptsUrl || "https://staticresumebuilder.com/gtwy/ges/web/common";
    const clientEventsAPIUrl = config.clientEventsAPIUrl || "https://staticresumebuilder.com/gtwy/ges";

    // Constructing URLs for required scripts
    const geniStreamScriptUrl = `${commonScriptsUrl}/scripts/genistream${config.useDevJs ? "" : ".min"}.js?v=${config.besVer || "latest"}`;
    const geniMDataScriptUrl = `${commonScriptsUrl}/scripts/genimdata${config.useDevJs ? "" : ".min"}.js?v=${config.muVer || "latest"}`;

    // Loading the scripts asynchronously
    const scriptPromises = [
        loadDynamicScriptFileAsync(geniStreamScriptUrl, true),
        loadDynamicScriptFileAsync(geniMDataScriptUrl, true)
    ];

    let GeniMetrics:any;

    // Once the scripts are loaded, initialize GeniMetrics
    return Promise.all(scriptPromises).then(() => {
        const newConfig = GeniMetrics.ClassInitializers.getNewConfigurationObject(config.MuCfg || {});

        // Set additional properties if provided in the config
        if (config.C_lgnId) newConfig.C_lgnId = config.C_lgnId;
        if (config.C_vId) newConfig.C_vId = config.C_vId;
        if (config.C_vTmpId) newConfig.C_vTmpId = config.C_vTmpId;
        if (config.C_vsId) newConfig.C_vsId = config.C_vsId;

        newConfig.Value_PortalCD = portalCD;
        newConfig.Value_ProductCD = productCD;
        newConfig.geniEventsUrl = geniStreamScriptUrl;
        newConfig.useForcePushForAllEvents = config.useForcePushForAllEvents || false;

        // Set the endpoint for events
        newConfig.GeniConfig.AjaxDetails.eventsPostEndpointUrl = `${clientEventsAPIUrl}/${newConfig.GeniConfig.AjaxDetails.eventsPostEndpointUrl}`;

        // Logging for debugging if enabled
        if (newConfig.GeniConfig.Commons.enableConsoleLogging) {
            console.log("Initialized Metrics Config: ", newConfig);
        }

        // Initialize GeniMetrics
        return GeniMetrics.initializeAsync(window, newConfig);
    });
}

// Determine which cookie to use for user status
const usr_status_cookie = document.cookie.includes("userinf") ? "userinf" : "UserStatus";

// Configuration object with custom settings for metrics
const addParamsData = {
    MuCfg: { enableWebVitals: true },
    C_vId: `_snt`,
    C_vTmpId: `_snsd`,
    C_vsId: `_sntd`,
    C_lgnId: usr_status_cookie
};

// Initialize metrics for the page
InitializeMetricsForPage("RGN", "RBG", addParamsData).then(() => {
    console.log("Metrics initialized successfully");
}).catch((error) => {
    console.error("Error initializing metrics: ", error);
});

