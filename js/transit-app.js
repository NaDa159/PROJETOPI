(function () {
    "use strict";

    const STORAGE_KEY = "paradaInteligente.data.v1";
    const CENTER = [-27.6345, -52.2735];
    const CITY_BOUNDS = [[-27.670, -52.323], [-27.615, -52.214]];
    const DEFAULT_SCHEDULE = {
        weekdays: ["06:00", "06:45", "07:35", "08:40", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"],
        saturday: ["06:00", "07:00", "08:00", "11:00", "12:00", "14:00", "16:00", "18:00"],
        sunday: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]
    };

    const NEIGHBORHOOD_STOP_IDS = new Set([
        "aeroporto", "ref-agricola-ii", "ref-aldo-arioli", "ref-amizade", "atlantico", "ref-bela-vista",
        "ref-boa-vista", "ref-centro", "ref-ceramica", "ref-copas-verdes", "ref-loteamento-cotrel",
        "ref-cristal", "cristo-rei", "ref-dal-molin", "ref-demoliner", "ref-esperanca", "ref-espirito-santo",
        "estevam-carraro", "ref-fatima", "ref-frinape", "industrial", "ref-ipiranga", "ref-jabuticabal",
        "ref-jose-bonifacio", "ref-koller", "ref-liberdade", "linho", "maria-clara", "ref-morada-do-sol",
        "ref-morro-cegonha", "ref-novo-atlantico", "paiol-grande", "ref-parque-imigrantes", "ref-parque-livia",
        "ref-praca-redencao", "ref-vila-village", "ref-presidente-vargas", "ref-progresso", "rio-tigre",
        "ref-santa-catarina", "ref-sao-caetano", "ref-sao-cristovao", "ref-sao-jose", "ref-sao-vicente",
        "tres-vendas", "ref-triangulo", "ref-uniao", "ref-vale-dourado", "ref-victoria-i", "ref-victoria-ii", "ref-zimmer"
    ]);

    const DEFAULT_STATE = {
        version: 3,
        stops: [
            { id: "terminal", name: "Terminal Central", lat: -27.62955, lng: -52.27541 },
            { id: "uri", name: "URI", lat: -27.6305, lng: -52.2675 },
            { id: "hospital-santa-terezinha", name: "Hospital Santa Terezinha", lat: -27.6322, lng: -52.2702 },
            { id: "prefeitura", name: "Prefeitura", lat: -27.6341, lng: -52.2715 },
            { id: "praca-bandeira", name: "Praça da Bandeira", lat: -27.6352, lng: -52.2744 },
            { id: "atlantico", name: "Atlântico", lat: -27.6430, lng: -52.2390 },
            { id: "paiol-grande", name: "Paiol Grande", lat: -27.6390, lng: -52.3180 },
            { id: "tres-vendas", name: "Três Vendas", lat: -27.6420, lng: -52.3000 },
            { id: "rio-tigre", name: "Rio Tigre", lat: -27.6601, lng: -52.2497 },
            { id: "industrial", name: "Distrito Industrial", lat: -27.6510, lng: -52.2480 },
            { id: "estevam-carraro", name: "Estevam Carraro", lat: -27.6520, lng: -52.2539 },
            { id: "novo-horizonte", name: "Novo Horizonte", lat: -27.6445, lng: -52.2858 },
            { id: "cristo-rei", name: "Cristo Rei", lat: -27.6660, lng: -52.2600 },
            { id: "aeroporto", name: "Aeroporto (referência)", lat: -27.660873, lng: -52.275986 },
            { id: "linho", name: "Linho", lat: -27.6380, lng: -52.2530 },
            { id: "maria-clara", name: "Maria Clara", lat: -27.6398, lng: -52.2336 },
            { id: "ref-rua-aratiba", name: "Rua Aratiba", lat: -27.6338, lng: -52.2752, reference: true },
            { id: "ref-rua-italia", name: "Rua Itália", lat: -27.6317, lng: -52.2783, reference: true },
            { id: "ref-jabuticabal", name: "Jabuticabal", lat: -27.6310, lng: -52.3050, reference: true },
            { id: "ref-loteamento-cotrel", name: "Loteamento Cotrel", lat: -27.6470, lng: -52.3130, reference: true },
            { id: "ref-agricola-ii", name: "Agrícola II", lat: -27.6570, lng: -52.3090, reference: true },
            { id: "ref-joao-batiston", name: "Rua João Batiston", lat: -27.6420, lng: -52.2970, reference: true },
            { id: "ref-presidente-vargas", name: "Presidente Vargas", lat: -27.6530, lng: -52.3030, reference: true },
            { id: "ref-ceramica", name: "Cerâmica", lat: -27.6540, lng: -52.2840, reference: true },
            { id: "ref-aldo-arioli", name: "Aldo Arioli", lat: -27.6490, lng: -52.2860, reference: true },
            { id: "ref-progresso", name: "Progresso", lat: -27.6608, lng: -52.2645, reference: true },
            { id: "ref-paiol-acesso", name: "Acesso ao Paiol Grande", lat: -27.6380, lng: -52.3180, reference: true },
            { id: "ref-vila-village", name: "Petit Vilage", lat: -27.6563, lng: -52.2574, reference: true },
            { id: "ref-helvetica", name: "Helvética", lat: -27.6230, lng: -52.2520, reference: true },
            { id: "ref-novo-atlantico", name: "Novo Atlântico", lat: -27.6340, lng: -52.2301, reference: true },
            { id: "ref-poltronieri", name: "Poltronieri", lat: -27.6400, lng: -52.2490, reference: true },
            { id: "ref-liberdade", name: "Liberdade", lat: -27.6490, lng: -52.2190, reference: true },
            { id: "ref-praca-redencao", name: "Parque Redenção", lat: -27.6460, lng: -52.2330, reference: true },
            { id: "ref-amizade", name: "Amizade", lat: -27.647, lng: -52.230, reference: true },
            { id: "ref-bela-vista", name: "Bela Vista", lat: -27.645, lng: -52.257, reference: true },
            { id: "ref-boa-vista", name: "Boa Vista", lat: -27.656, lng: -52.295, reference: true },
            { id: "ref-copas-verdes", name: "Copas Verdes", lat: -27.628, lng: -52.241, reference: true },
            { id: "ref-cristal", name: "Cristal", lat: -27.619, lng: -52.247, reference: true },
            { id: "ref-dal-molin", name: "Dal Molin", lat: -27.629, lng: -52.290, reference: true },
            { id: "ref-demoliner", name: "Demoliner", lat: -27.620, lng: -52.231, reference: true },
            { id: "ref-esperanca", name: "Esperança", lat: -27.623, lng: -52.262, reference: true },
            { id: "ref-espirito-santo", name: "Espírito Santo", lat: -27.641, lng: -52.284, reference: true },
            { id: "ref-fatima", name: "Fátima", lat: -27.649, lng: -52.267, reference: true },
            { id: "ref-frinape", name: "Frinape", lat: -27.665, lng: -52.294, reference: true },
            { id: "ref-ipiranga", name: "Ipiranga", lat: -27.628, lng: -52.283, reference: true },
            { id: "ref-jose-bonifacio", name: "José Bonifácio", lat: -27.629, lng: -52.258, reference: true },
            { id: "ref-koller", name: "Koller", lat: -27.645, lng: -52.290, reference: true },
            { id: "ref-morada-do-sol", name: "Morada do Sol", lat: -27.638, lng: -52.245, reference: true },
            { id: "ref-parque-imigrantes", name: "Parque dos Imigrantes", lat: -27.647, lng: -52.280, reference: true },
            { id: "ref-parque-livia", name: "Parque Lívia", lat: -27.635, lng: -52.241, reference: true },
            { id: "ref-santa-catarina", name: "Santa Catarina", lat: -27.637, lng: -52.291, reference: true },
            { id: "ref-sao-caetano", name: "São Caetano", lat: -27.619, lng: -52.271, reference: true },
            { id: "ref-sao-cristovao", name: "São Cristóvão", lat: -27.653, lng: -52.274, reference: true },
            { id: "ref-sao-jose", name: "São José", lat: -27.656, lng: -52.263, reference: true },
            { id: "ref-sao-vicente", name: "São Vicente de Paulo", lat: -27.630, lng: -52.248, reference: true },
            { id: "ref-triangulo", name: "Triângulo", lat: -27.634, lng: -52.290, reference: true },
            { id: "ref-uniao", name: "União", lat: -27.633, lng: -52.240, reference: true },
            { id: "ref-vale-dourado", name: "Vale Dourado", lat: -27.622, lng: -52.287, reference: true },
            { id: "ref-victoria-i", name: "Victoria I", lat: -27.659, lng: -52.269, reference: true },
            { id: "ref-victoria-ii", name: "Victoria II", lat: -27.659, lng: -52.286, reference: true },
            { id: "ref-zimmer", name: "Zimmer", lat: -27.623, lng: -52.252, reference: true },
            { id: "ref-centro", name: "Centro", lat: -27.635, lng: -52.273, reference: true },
            { id: "ref-morro-cegonha", name: "Morro da Cegonha", lat: -27.623, lng: -52.270, reference: true }
        ],
        lines: [
            { id: "line-18", number: "18", name: "Rio Tigre", color: "#2563eb", stopIds: ["terminal", "uri", "estevam-carraro", "rio-tigre", "industrial", "terminal"], schedules: null, arrivalMinutes: 5 },
            { id: "line-30", number: "30", name: "Atlântico", color: "#ea7b16", stopIds: ["terminal", "praca-bandeira", "atlantico", "linho", "maria-clara", "terminal"], schedules: null, arrivalMinutes: 15 },
            { id: "line-32", number: "32", name: "Paiol Grande", color: "#16865f", stopIds: ["terminal", "tres-vendas", "paiol-grande", "terminal"], schedules: null, arrivalMinutes: 20 },
            { id: "line-33", number: "33", name: "Novo Horizonte / Cristo Rei", color: "#9f1239", stopIds: ["terminal", "novo-horizonte", "cristo-rei", "aeroporto", "terminal"], schedules: null, arrivalMinutes: 25 }
        ],
        reports: []
    };

    let state = null;
    let map = null;
    let routeLayer = null;
    let stopLayer = null;
    let previewLayer = null;
    const routeGeometryCache = new Map();
    const pendingRouteGeometry = new Set();
    let selectedStopId = "terminal";
    let selectedLineId = "line-18";
    let searchValue = "";
    let arrivalClockStarted = Date.now();
    let toastTimer = 0;
    let storageNoticeShown = false;
    let currentRole = "usuario";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function safeColor(value) {
        return /^#[0-9a-fA-F]{6}$/.test(String(value || "")) ? value : "#2563eb";
    }

    function safetyLevel(stop) {
        return stop.alertActive ? "red" : stop.securityLevel;
    }

    function safetyLabel(level) {
        return ({ green: "Normal", yellow: "Atenção", red: "Alerta" })[level] || "Normal";
    }

    function isCityCoordinate(lat, lng) {
        return lat >= CITY_BOUNDS[0][0] && lat <= CITY_BOUNDS[1][0]
            && lng >= CITY_BOUNDS[0][1] && lng <= CITY_BOUNDS[1][1];
    }

    function normalizeState(value) {
        if (!value || !Array.isArray(value.stops) || !Array.isArray(value.lines)) return clone(DEFAULT_STATE);

        return {
            version: 3,
            stops: value.stops.filter((stop) => stop && typeof stop.id === "string" && typeof stop.name === "string" && Number.isFinite(Number(stop.lat)) && Number.isFinite(Number(stop.lng))).map((stop, index) => ({
                id: stop.id,
                name: stop.id === "aeroporto" ? "Aeroporto" : (stop.id === "ref-agricola-ii" ? "Agrícola" : (stop.id === "ref-loteamento-cotrel" ? "Cotrel" : stop.name)),
                lat: Number(stop.lat),
                lng: Number(stop.lng),
                reference: stop.reference === true,
                neighborhood: NEIGHBORHOOD_STOP_IDS.has(stop.id),
                peopleCount: Number.isFinite(Number(stop.peopleCount)) ? Math.max(0, Math.min(999, Math.round(Number(stop.peopleCount)))) : (index * 7 + 3) % 14 + 1,
                securityLevel: ["green", "yellow", "red"].includes(stop.securityLevel) ? stop.securityLevel : (index > 0 && index % 9 === 0 ? "yellow" : "green"),
                alertActive: stop.alertActive === true
            })),
            lines: value.lines.filter((line) => line && typeof line.id === "string" && typeof line.number === "string" && Array.isArray(line.stopIds)).map((line, index) => ({
                id: line.id,
                number: line.number,
                name: String(line.name || "Linha " + line.number),
                color: safeColor(line.color),
                stopIds: line.stopIds.filter((id) => typeof id === "string"),
                schedules: line.schedules && typeof line.schedules === "object" ? line.schedules : clone(DEFAULT_SCHEDULE),
                arrivalMinutes: Number.isFinite(Number(line.arrivalMinutes)) ? Number(line.arrivalMinutes) : 7 + index * 5
            })),
            reports: Array.isArray(value.reports) ? value.reports.filter((report) => report && typeof report.message === "string") : []
        };
    }

    function loadState() {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === null) {
                state = normalizeState(clone(DEFAULT_STATE));
                saveState(false);
                return;
            }
            const saved = JSON.parse(stored);
            const metricsMigrated = Array.isArray(saved.stops) && saved.stops.some((stop) => !Number.isFinite(Number(stop.peopleCount)) || !["green", "yellow", "red"].includes(stop.securityLevel) || typeof stop.alertActive !== "boolean" || typeof stop.neighborhood !== "boolean" || stop.id === "aeroporto" && stop.name !== "Aeroporto" || stop.id === "ref-agricola-ii" && stop.name !== "Agrícola" || stop.id === "ref-loteamento-cotrel" && stop.name !== "Cotrel");
            state = normalizeState(saved);
            const previousSeedLocations = {
                terminal: { oldLat: -27.6345, oldLng: -52.2735, lat: -27.62955, lng: -52.27541 },
                aeroporto: { oldLat: -27.6206, oldLng: -52.2762, lat: -27.660873, lng: -52.275986 },
                atlantico: { oldLat: -27.6285, oldLng: -52.2710, lat: -27.6430, lng: -52.2390 },
                "paiol-grande": { oldLat: -27.6225, oldLng: -52.2890, lat: -27.6390, lng: -52.3180 },
                "tres-vendas": { oldLat: -27.6288, oldLng: -52.2810, lat: -27.6420, lng: -52.3000 },
                "rio-tigre": { oldLat: -27.6168, oldLng: -52.2498, lat: -27.6601, lng: -52.2497 },
                industrial: { oldLat: -27.6105, oldLng: -52.2448, lat: -27.6510, lng: -52.2480 },
                "estevam-carraro": { oldLat: -27.6227, oldLng: -52.2584, lat: -27.6520, lng: -52.2539 },
                "cristo-rei": { oldLat: -27.6185, oldLng: -52.2941, lat: -27.6660, lng: -52.2600 },
                linho: { oldLat: -27.6502, oldLng: -52.2897, lat: -27.6380, lng: -52.2530 },
                "maria-clara": { oldLat: -27.6564, oldLng: -52.2838, lat: -27.6398, lng: -52.2336 }
            };
            let locationsMigrated = false;
            state.stops.forEach((stop) => {
                const previous = previousSeedLocations[stop.id];
                if (!previous || stop.lat !== previous.oldLat || stop.lng !== previous.oldLng) return;
                stop.lat = previous.lat;
                stop.lng = previous.lng;
                locationsMigrated = true;
            });
            const knownStopIds = new Set(state.stops.map((stop) => stop.id));
            const addedReferences = DEFAULT_STATE.stops.filter((stop) => stop.reference && !knownStopIds.has(stop.id));
            if (addedReferences.length) {
                state.stops.push(...clone(addedReferences));
            }
            if (addedReferences.length || locationsMigrated || metricsMigrated) saveState(false);
        } catch (error) {
            state = normalizeState(clone(DEFAULT_STATE));
            storageNoticeShown = true;
        }
    }

    function saveState(announceError = true) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return true;
        } catch (error) {
            if (announceError && !storageNoticeShown) {
                showToast("O navegador não permitiu salvar os dados neste dispositivo.");
                storageNoticeShown = true;
            }
            return false;
        }
    }

    function createId(prefix) {
        return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
    }

    function getStop(id) {
        return state.stops.find((stop) => stop.id === id) || null;
    }

    function getLine(id) {
        return state.lines.find((line) => line.id === id) || null;
    }

    function selectedStop() {
        return getStop(selectedStopId) || state.stops[0] || { name: "Erechim", lat: CENTER[0], lng: CENTER[1] };
    }

    function normalizeSearch(value) {
        return String(value || "").trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function lineSearchText(line) {
        const stops = line.stopIds.map(getStop).filter(Boolean).map((stop) => stop.name);
        return normalizeSearch([line.number, line.name, ...stops].join(" "));
    }

    function matchesLine(line) {
        return !searchValue || lineSearchText(line).includes(normalizeSearch(searchValue));
    }

    function updateClock() {
        const now = new Date();
        const timeNode = document.getElementById("relogio");
        const dateNode = document.getElementById("data-atual");
        if (!timeNode || !dateNode) return;

        timeNode.textContent = now.toLocaleTimeString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit"
        });
        dateNode.textContent = now.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            weekday: "short",
            day: "2-digit",
            month: "short"
        });
    }

    const weatherLabels = {
        0: ["\u2600", "Céu limpo"],
        1: ["\u26c5", "Poucas nuvens"],
        2: ["\u26c5", "Parcialmente nublado"],
        3: ["\u2601", "Nublado"],
        45: ["\u224b", "Neblina"],
        48: ["\u224b", "Neblina"],
        51: ["\u2614", "Garoa leve"],
        53: ["\u2614", "Garoa"],
        55: ["\u2614", "Garoa intensa"],
        61: ["\u2614", "Chuva leve"],
        63: ["\u2614", "Chuva"],
        65: ["\u2614", "Chuva forte"],
        71: ["\u2744", "Neve leve"],
        73: ["\u2744", "Neve"],
        75: ["\u2744", "Neve forte"],
        80: ["\u2614", "Pancadas de chuva"],
        81: ["\u2614", "Pancadas de chuva"],
        82: ["\u2614", "Pancadas fortes"],
        95: ["\u26a1", "Trovoadas"],
        96: ["\u26a1", "Trovoadas"],
        99: ["\u26a1", "Trovoadas fortes"]
    };

    async function updateWeather() {
        const temperature = document.getElementById("weather-temperature");
        const description = document.getElementById("weather-description");
        const icon = document.getElementById("weather-icon");
        if (!temperature || !description || !icon) return;

        try {
            const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-27.6353&longitude=-52.2743&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo");
            if (!response.ok) throw new Error("Weather request failed");
            const weather = await response.json();
            const current = weather.current;
            const label = weatherLabels[current.weather_code] || ["\u2601", "Condição atual"];
            icon.textContent = label[0];
            temperature.textContent = Math.round(current.temperature_2m) + "\u00b0C";
            description.textContent = label[1];
        } catch (error) {
            icon.textContent = "\u2601";
            temperature.textContent = "--\u00b0C";
            description.textContent = "Clima indisponível";
        }
    }

    function createCityBaseLayer() {
        const cityArt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        cityArt.setAttribute("viewBox", "0 0 1200 900");
        cityArt.setAttribute("preserveAspectRatio", "none");
        cityArt.setAttribute("aria-hidden", "true");
        cityArt.innerHTML = `
            <defs>
                <pattern id="erechim-streets" width="116" height="88" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
                    <rect width="116" height="88" fill="#ffffff" />
                    <path d="M0 17H116 M0 71H116 M24 0V88 M91 0V88" fill="none" stroke="#e8edf0" stroke-width="11" />
                    <path d="M0 17H116 M0 71H116 M24 0V88 M91 0V88" fill="none" stroke="#ffffff" stroke-width="1.5" opacity=".95" />
                    <path d="M29 22h56v44H29z" fill="#fbfcfd" stroke="#e8edf0" stroke-width="2" />
                </pattern>
                <linearGradient id="erechim-day" x1="0" x2="1" y1="1" y2="0">
                    <stop offset="0" stop-color="#ffffff" />
                    <stop offset="1" stop-color="#f8fafb" />
                </linearGradient>
            </defs>
            <rect width="1200" height="900" fill="url(#erechim-day)" />
            <rect width="1200" height="900" fill="url(#erechim-streets)" opacity=".94" />
            <path d="M-30 160C130 180 180 118 300 150S490 208 620 170 870 90 1230 145V-20H-30Z" fill="#edf4eb" stroke="#dce7da" stroke-width="3" />
            <path d="M-30 760C125 690 185 730 275 690S430 632 500 665 645 760 780 725 1000 650 1230 705V930H-30Z" fill="#edf4eb" stroke="#dce7da" stroke-width="3" />
            <path d="M-20 635C180 600 285 490 470 470S820 370 1220 80" fill="none" stroke="#ffffff" stroke-width="34" stroke-linecap="round" />
            <path d="M-20 635C180 600 285 490 470 470S820 370 1220 80" fill="none" stroke="#c7cecb" stroke-width="18" stroke-linecap="round" />
            <path d="M170 -30C245 180 355 300 520 455S770 710 870 930" fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round" />
            <path d="M170 -30C245 180 355 300 520 455S770 710 870 930" fill="none" stroke="#c7cecb" stroke-width="15" stroke-linecap="round" />
            <path d="M-20 395C190 405 310 370 455 390S735 440 900 390 1080 350 1220 365" fill="none" stroke="#ffffff" stroke-width="28" stroke-linecap="round" />
            <path d="M-20 395C190 405 310 370 455 390S735 440 900 390 1080 350 1220 365" fill="none" stroke="#c7cecb" stroke-width="13" stroke-linecap="round" />
            <path d="M590 -20C565 150 625 255 615 405S580 690 630 920" fill="none" stroke="#ffffff" stroke-width="25" stroke-linecap="round" />
            <path d="M590 -20C565 150 625 255 615 405S580 690 630 920" fill="none" stroke="#c7cecb" stroke-width="12" stroke-linecap="round" />
            <g fill="#68716d" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="3" opacity=".85">
                <text x="470" y="425">ERECHIM - CENTRO</text>
            </g>
            <g fill="#858e89" font-family="Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="2" opacity=".9">
                <text x="445" y="370">TRES VENDAS</text>
                <text x="620" y="355">ATLANTICO</text>
                <text x="900" y="235">RIO TIGRE</text>
                <text x="330" y="575">NOVO HORIZONTE</text>
                <text x="300" y="320">PAIOL GRANDE</text>
            </g>
        `;
        return L.svgOverlay(cityArt, L.latLngBounds(CITY_BOUNDS), {
            pane: "localBasePane",
            opacity: 1,
            interactive: false
        });
    }

    function createCityMaskLayer() {
        const mask = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        mask.setAttribute("viewBox", "0 0 1000 1000");
        mask.setAttribute("preserveAspectRatio", "none");
        mask.setAttribute("aria-hidden", "true");
        const layer = L.svgOverlay(mask, map.getBounds(), {
            pane: "cityMaskPane",
            interactive: false
        }).addTo(map);

        const updateMask = () => {
            const viewport = map.getBounds();
            const latitudeSpan = viewport.getNorth() - viewport.getSouth();
            const longitudeSpan = viewport.getEast() - viewport.getWest();
            const left = ((CITY_BOUNDS[0][1] - viewport.getWest()) / longitudeSpan) * 1000;
            const right = ((CITY_BOUNDS[1][1] - viewport.getWest()) / longitudeSpan) * 1000;
            const top = ((viewport.getNorth() - CITY_BOUNDS[1][0]) / latitudeSpan) * 1000;
            const bottom = ((viewport.getNorth() - CITY_BOUNDS[0][0]) / latitudeSpan) * 1000;
            mask.innerHTML = '<path d="M0 0H1000V1000H0Z M' + left + ' ' + top + 'H' + right + 'V' + bottom + 'H' + left + 'Z" fill="#ffffff" fill-rule="evenodd" />';
            layer.setBounds(viewport);
        };
        updateMask();
        map.on("moveend zoomend resize", updateMask);
        return layer;
    }

    function getRouteGeometryKey(line, points) {
        return line.id + "|" + points.map(([lat, lng]) => lat + "," + lng).join(";");
    }

    function requestStreetRoute(line, points, cacheKey) {
        if (routeGeometryCache.has(cacheKey) || pendingRouteGeometry.has(cacheKey) || points.length < 2) return;

        pendingRouteGeometry.add(cacheKey);
        const coordinates = points.map(([lat, lng]) => lng + "," + lat).join(";");
        const url = "https://router.project-osrm.org/route/v1/driving/" + coordinates + "?overview=full&geometries=geojson&steps=false";

        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Street route is unavailable");
                return response.json();
            })
            .then((result) => {
                const coordinates = result.code === "Ok" ? result.routes?.[0]?.geometry?.coordinates : null;
                const geometry = Array.isArray(coordinates) ? coordinates.map(([lng, lat]) => [lat, lng]) : null;
                routeGeometryCache.set(cacheKey, geometry && geometry.length > 1 ? geometry : null);
                if (geometry && geometry.length > 1 && map) drawMap();
            })
            .catch(() => routeGeometryCache.set(cacheKey, null))
            .finally(() => pendingRouteGeometry.delete(cacheKey));
    }

    function initializeMap() {
        const mapElement = document.getElementById("mapa");
        if (!window.L) {
            mapElement.querySelector(".map-fallback").textContent = "O mapa precisa de conexão para carregar. Os cadastros continuam disponíveis.";
            return;
        }

        mapElement.querySelector(".map-fallback")?.remove();
        map = L.map("mapa", {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
            minZoom: 11,
            maxZoom: 19,
            maxBoundsViscosity: 1
        });
        map.fitBounds(L.latLngBounds(CITY_BOUNDS), { padding: [18, 18], maxZoom: 14 });
        const constrainMapToCity = () => {
            const viewport = map.getBounds();
            const halfHeight = (viewport.getNorth() - viewport.getSouth()) / 2;
            const halfWidth = (viewport.getEast() - viewport.getWest()) / 2;
            map.setMaxBounds(L.latLngBounds(
                [CITY_BOUNDS[0][0] - halfHeight, CITY_BOUNDS[0][1] - halfWidth],
                [CITY_BOUNDS[1][0] + halfHeight, CITY_BOUNDS[1][1] + halfWidth]
            ));
        };
        constrainMapToCity();
        map.on("zoomend resize", constrainMapToCity);

        map.createPane("localBasePane");
        map.getPane("localBasePane").style.zIndex = 150;
        createCityBaseLayer().addTo(map);
        map.createPane("cityMaskPane");
        map.getPane("cityMaskPane").style.zIndex = 300;
        const attribution = document.querySelector(".map-attribution");
        const streetLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
            minZoom: 11,
            maxZoom: 19,
            bounds: L.latLngBounds(CITY_BOUNDS),
            attribution: "Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
        });
        const labelsLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
            minZoom: 11,
            maxZoom: 19,
            bounds: L.latLngBounds(CITY_BOUNDS),
            attribution: ""
        });
        streetLayer.once("tileerror", () => {
            if (!map.hasLayer(streetLayer)) return;
            map.removeLayer(streetLayer);
            if (map.hasLayer(labelsLayer)) map.removeLayer(labelsLayer);
            if (attribution) attribution.textContent = "Mapa urbano esquemático local - paradas aproximadas";
        });
        labelsLayer.once("tileerror", () => {
            if (map.hasLayer(labelsLayer)) map.removeLayer(labelsLayer);
        });
        streetLayer.addTo(map);
        labelsLayer.addTo(map);
        createCityMaskLayer();
        if (attribution) attribution.innerHTML = "Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors";

        routeLayer = L.layerGroup().addTo(map);
        stopLayer = L.layerGroup().addTo(map);
        previewLayer = L.layerGroup().addTo(map);
        document.getElementById("zoom-in").addEventListener("click", () => map.zoomIn());
        document.getElementById("zoom-out").addEventListener("click", () => map.zoomOut());
        drawMap();
        window.requestAnimationFrame(() => map.invalidateSize());
    }

    function makeStopIcon(stop) {
        const isTerminal = stop.id === "terminal" || normalizeSearch(stop.name).includes("terminal");
        const className = "map-stop-marker is-" + safetyLevel(stop) + (isTerminal ? " is-terminal" : "");
        const glyph = isTerminal
            ? '<path d="M6 17V7.5A2.5 2.5 0 0 1 8.5 5h7A2.5 2.5 0 0 1 18 7.5V17M6 11h12M8 17v2m8-2v2M9 8h6"/>'
            : '<path d="M7 3h10v18H7zM10 7h4M10 11h4M10 15h4"/>';
        return L.divIcon({
            className: "map-stop-icon",
            html: '<span class="' + className + '" aria-hidden="true"><svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + glyph + '</g></svg></span>',
            iconSize: isTerminal ? [32, 32] : [26, 26],
            iconAnchor: isTerminal ? [16, 16] : [13, 13],
            popupAnchor: [0, -8]
        });
    }

    function makePopup(stop) {
        const content = document.createElement("div");
        const strong = document.createElement("strong");
        const detail = document.createElement("div");
        const crowd = document.createElement("div");
        const safety = document.createElement("div");
        const latestReport = state.reports.find((report) => report.stopId === stop.id);
        strong.textContent = stop.name;
        detail.textContent = stop.neighborhood
            ? "Centro aproximado do bairro · não indica poste oficial de ônibus"
            : (stop.reference ? "Referência de itinerário · posição aproximada" : "Ponto do protótipo · Erechim, RS");
        crowd.textContent = stop.peopleCount + " pessoas (estimativa do protótipo)";
        safety.className = "map-popup-safety is-" + safetyLevel(stop);
        safety.textContent = "Segurança: " + safetyLabel(safetyLevel(stop)) + (stop.alertActive ? " · alerta ativo" : "");
        content.append(strong, detail, crowd, safety);
        if (stop.alertActive && latestReport) {
            const alert = document.createElement("div");
            alert.className = "map-popup-alert";
            alert.textContent = "Relato: " + latestReport.category + " · " + latestReport.message;
            content.append(alert);
        }
        return content;
    }

    function makeLineBusIcon(line) {
        const badge = document.createElement("span");
        const number = document.createElement("span");
        badge.className = "map-line-bus-badge";
        badge.style.setProperty("--line-color", safeColor(line.color));
        badge.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16.5V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8v9.7M5 11h14M7.5 16.5v2m9-2v2M7.8 19h8.4M8 7.5h8"/></svg>';
        number.textContent = line.number;
        badge.append(number);
        return L.divIcon({
            className: "map-line-bus-icon",
            html: badge,
            iconSize: [72, 42],
            iconAnchor: [36, 21],
            popupAnchor: [0, -19]
        });
    }

    function drawMap() {
        if (!map || !routeLayer || !stopLayer) return;
        routeLayer.clearLayers();
        stopLayer.clearLayers();

        const matchingLines = state.lines.filter(matchesLine);
        const matchingStopIds = new Set();
        matchingLines.forEach((line) => line.stopIds.forEach((id) => matchingStopIds.add(id)));

        const orderedLines = matchingLines.filter((line) => line.id !== selectedLineId)
            .concat(matchingLines.filter((line) => line.id === selectedLineId));

        orderedLines.forEach((line) => {
            const stops = line.stopIds.map(getStop).filter(Boolean);
            const stopPoints = stops.map((stop) => [stop.lat, stop.lng]);
            if (stopPoints.length < 2) return;
            const active = line.id === selectedLineId;
            const cacheKey = getRouteGeometryKey(line, stopPoints);
            requestStreetRoute(line, stopPoints, cacheKey);
            const points = routeGeometryCache.get(cacheKey) || stopPoints;
            L.polyline(points, {
                color: "#ffffff",
                weight: active ? 11 : 8,
                opacity: active ? 0.96 : 0.76,
                lineCap: "round",
                lineJoin: "round",
                bubblingMouseEvents: false
            }).addTo(routeLayer);
            const route = L.polyline(points, {
                color: safeColor(line.color),
                weight: active ? 7 : 5,
                opacity: active ? 1 : 0.86,
                lineCap: "round",
                lineJoin: "round",
                bubblingMouseEvents: false
            }).addTo(routeLayer);
            route.on("click", () => selectLine(line.id, true));

            const midpoint = points[Math.floor(points.length / 2)];
            const bus = L.marker(midpoint, {
                icon: makeLineBusIcon(line),
                keyboard: true,
                title: "Ônibus da linha " + line.number,
                zIndexOffset: 600
            }).addTo(stopLayer);
            bus.on("click", () => selectLine(line.id, true));
        });

        const query = normalizeSearch(searchValue);
        state.stops.forEach((stop) => {
            if (query && !normalizeSearch(stop.name).includes(query) && !matchingStopIds.has(stop.id)) return;
            const marker = L.marker([stop.lat, stop.lng], {
                icon: makeStopIcon(stop),
                keyboard: true,
                title: stop.name
            }).addTo(stopLayer);
            marker.bindPopup(makePopup(stop));
            marker.on("click", () => selectStop(stop.id));
        });
    }

    function previewRoute(line) {
        if (!map || !previewLayer) return;
        previewLayer.clearLayers();
        if (!line || !Array.isArray(line.stopIds)) return;
        const points = line.stopIds.map(getStop).filter(Boolean).map((stop) => [stop.lat, stop.lng]);
        if (points.length < 2) return;
        const route = L.polyline(points, {
            color: safeColor(line.color),
            weight: 7,
            opacity: 0.96,
            dashArray: "8 8",
            lineCap: "round",
            lineJoin: "round",
            bubblingMouseEvents: false
        }).addTo(previewLayer);
        route.bindTooltip("Prévia da rota", { sticky: true });
        map.fitBounds(L.latLngBounds(points), { padding: [55, 55], maxZoom: 14 });
    }

    function lineDestination(line) {
        const lastUsefulStop = line.stopIds.map(getStop).filter(Boolean).filter((stop) => stop.id !== "terminal").at(-1);
        return lastUsefulStop ? lastUsefulStop.name : line.name;
    }

    function makeArrivalCard(line, minutes) {
        const button = document.createElement("button");
        const mark = document.createElement("span");
        const copy = document.createElement("span");
        const title = document.createElement("strong");
        const destination = document.createElement("span");
        const eta = document.createElement("span");

        button.type = "button";
        button.className = "arrival-card" + (line.id === selectedLineId ? " is-active" : "");
        button.dataset.lineId = line.id;
        button.setAttribute("aria-label", "Linha " + line.number + ", " + line.name + ", " + (minutes === 0 ? "chegando" : "em " + minutes + " minutos"));
        mark.className = "arrival-line-mark";
        mark.style.backgroundColor = safeColor(line.color);
        mark.textContent = line.number;
        copy.className = "arrival-copy";
        title.textContent = "Linha " + line.number + " · " + line.name;
        destination.textContent = "Destino " + lineDestination(line);
        copy.append(title, destination);
        eta.className = "arrival-time" + (minutes === 0 ? " is-arriving" : "");
        eta.textContent = minutes === 0 ? "Chegando" : "Em " + minutes + " min";
        button.append(mark, copy, eta);
        button.addEventListener("click", () => selectLine(line.id, true));
        return button;
    }

    function renderArrivals() {
        const container = document.getElementById("arrival-list");
        if (!container) return;
        container.replaceChildren();

        const stop = selectedStop();
        const elapsedMinutes = Math.floor((Date.now() - arrivalClockStarted) / 60000);
        const arrivals = state.lines
            .filter((line) => line.stopIds.includes(stop.id) && matchesLine(line))
            .map((line, index) => ({
                line,
                minutes: Math.max(0, Number(line.arrivalMinutes || (5 + index * 5)) - elapsedMinutes)
            }))
            .sort((a, b) => a.minutes - b.minutes);

        document.getElementById("selected-stop-summary").textContent = stop.name;
        if (arrivals.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = searchValue ? "Nenhuma linha ou parada corresponde a essa busca." : "Não há linhas cadastradas nesta parada.";
            container.append(empty);
            return;
        }

        arrivals.slice(0, 5).forEach(({ line, minutes }) => container.append(makeArrivalCard(line, minutes)));
    }

    function renderRouteList() {
        const container = document.getElementById("route-list");
        const count = document.getElementById("line-count");
        if (!container) return;
        container.replaceChildren();
        const visibleLines = state.lines.filter(matchesLine);
        count.textContent = visibleLines.length + (visibleLines.length === 1 ? " linha" : " linhas");

        if (!visibleLines.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "Nenhuma linha encontrada.";
            container.append(empty);
            return;
        }

        visibleLines.forEach((line) => {
            const button = document.createElement("button");
            const dot = document.createElement("i");
            const number = document.createElement("strong");
            const name = document.createElement("span");
            button.type = "button";
            button.className = "route-row" + (line.id === selectedLineId ? " is-active" : "");
            button.dataset.lineId = line.id;
            dot.className = "route-row-dot";
            dot.style.backgroundColor = safeColor(line.color);
            number.textContent = line.number;
            name.textContent = line.name;
            button.append(dot, number, name);
            button.addEventListener("click", () => selectLine(line.id, true));
            container.append(button);
        });
    }

    function renderStopMonitoring() {
        const container = document.getElementById("stop-monitor-list");
        if (!container) return;
        container.replaceChildren();

        const alertCount = state.stops.filter((stop) => safetyLevel(stop) === "red").length;
        const stopCount = document.getElementById("monitor-stop-count");
        const alerts = document.getElementById("monitor-alert-count");
        if (stopCount) {
            const neighborhoodCount = state.stops.filter((stop) => stop.neighborhood).length;
            stopCount.textContent = neighborhoodCount + " bairros · " + state.stops.length + " pontos";
        }
        if (alerts) alerts.textContent = alertCount + (alertCount === 1 ? " alerta" : " alertas");

        const orderedStops = state.stops.slice().sort((a, b) => {
            if (a.alertActive !== b.alertActive) return a.alertActive ? -1 : 1;
            const priority = { red: 0, yellow: 1, green: 2 };
            return priority[safetyLevel(a)] - priority[safetyLevel(b)] || a.name.localeCompare(b.name, "pt-BR");
        });
        orderedStops.forEach((stop) => {
            const row = document.createElement("article");
            const heading = document.createElement("div");
            const dot = document.createElement("i");
            const name = document.createElement("strong");
            const summary = document.createElement("small");
            const controls = document.createElement("div");
            const people = document.createElement("input");
            const level = document.createElement("select");
            const focus = document.createElement("button");

            row.className = "stop-monitor-row is-" + safetyLevel(stop) + (stop.alertActive ? " has-alert" : "");
            row.dataset.stopId = stop.id;
            heading.className = "stop-monitor-heading";
            dot.className = "monitor-status-dot is-" + safetyLevel(stop);
            name.textContent = stop.name;
            summary.textContent = stop.peopleCount + " pessoas · " + safetyLabel(safetyLevel(stop)) + (stop.alertActive ? " · relato novo" : "");
            heading.append(dot, name);
            controls.className = "stop-monitor-controls";
            people.type = "number";
            people.min = "0";
            people.max = "999";
            people.step = "1";
            people.value = String(stop.peopleCount);
            people.dataset.stopPeople = stop.id;
            people.setAttribute("aria-label", "Pessoas estimadas em " + stop.name);
            [
                ["green", "Verde · Normal"],
                ["yellow", "Amarelo · Atenção"],
                ["red", "Vermelho · Alerta"]
            ].forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                level.append(option);
            });
            level.value = safetyLevel(stop);
            level.disabled = stop.alertActive;
            level.dataset.stopLevel = stop.id;
            level.setAttribute("aria-label", "Nível de segurança em " + stop.name);
            focus.type = "button";
            focus.className = stop.alertActive ? "monitor-dismiss" : "monitor-focus";
            focus.dataset.monitorAction = stop.alertActive ? "dismiss" : "focus";
            focus.dataset.stopId = stop.id;
            focus.textContent = stop.alertActive ? "Encerrar" : "Ver no mapa";
            focus.setAttribute("aria-label", (stop.alertActive ? "Encerrar alerta em " : "Localizar ") + stop.name);
            summary.title = "Contagem e nível de segurança simulados neste protótipo.";
            controls.append(people, level, focus);
            row.append(heading, summary, controls);
            container.append(row);
        });
    }

    function renderReportStopOptions() {
        const select = document.getElementById("sos-stop-select");
        if (!select) return;
        const selected = state.stops.some((stop) => stop.id === selectedStopId) ? selectedStopId : state.stops[0]?.id;
        select.replaceChildren();
        state.stops.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR")).forEach((stop) => {
            const option = document.createElement("option");
            option.value = stop.id;
            option.textContent = stop.name + (stop.neighborhood ? " · referência aproximada" : "");
            select.append(option);
        });
        if (selected) select.value = selected;
    }

    function renderAll() {
        if (!getStop(selectedStopId)) selectedStopId = state.stops[0]?.id || "";
        if (!getLine(selectedLineId)) selectedLineId = state.lines[0]?.id || "";
        const stop = selectedStop();
        document.getElementById("selected-stop-name").textContent = stop.name;
        document.getElementById("map-stop-name").textContent = stop.name;
        renderArrivals();
        renderRouteList();
        drawMap();
        renderStopMonitoring();
        if (window.TransitAdmin && currentRole === "administrador") window.TransitAdmin.refresh(state);
    }

    function selectLine(lineId, centerMap) {
        const line = getLine(lineId);
        if (!line) return;
        selectedLineId = line.id;
        if (!line.stopIds.includes(selectedStopId)) {
            const firstStop = line.stopIds.map(getStop).find(Boolean);
            if (firstStop) selectStop(firstStop.id, false);
        }
        renderArrivals();
        renderRouteList();
        drawMap();
        if (centerMap && map) {
            const points = line.stopIds.map(getStop).filter(Boolean).map((stop) => [stop.lat, stop.lng]);
            if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [45, 45], maxZoom: 14 });
        }
    }

    function selectStop(stopId, recenter) {
        const stop = getStop(stopId);
        if (!stop) return;
        selectedStopId = stop.id;
        document.getElementById("selected-stop-name").textContent = stop.name;
        document.getElementById("map-stop-name").textContent = stop.name;
        const summary = document.getElementById("selected-stop-summary");
        if (summary) summary.textContent = stop.name;
        renderArrivals();
        if (recenter !== false && map) map.panTo([stop.lat, stop.lng]);
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
    }

    function openDialog(id) {
        const dialog = document.getElementById(id);
        if (!dialog || typeof dialog.showModal !== "function") return;
        if (!dialog.open) dialog.showModal();
    }

    function bindCommonControls() {
        document.querySelectorAll("[data-close-dialog]").forEach((button) => {
            button.addEventListener("click", () => {
                const dialogId = button.dataset.closeDialog;
                if (dialogId) document.getElementById(dialogId)?.close();
            });
        });
        document.querySelectorAll(".transit-dialog").forEach((dialog) => {
            dialog.addEventListener("click", (event) => {
                if (event.target === dialog) dialog.close();
            });
        });

        document.querySelectorAll("[data-open-schedules]").forEach((button) => button.addEventListener("click", () => {
            const heading = document.getElementById("schedule-dialog-title");
            const note = document.querySelector("#schedule-dialog .dialog-header p");
            if (heading) heading.textContent = "Hor\u00e1rios · Prot\u00f3tipo";
            if (note) note.textContent = "Grade ilustrativa; n\u00e3o representa hor\u00e1rios atuais nem sa\u00eddas em tempo real.";
            renderScheduleTable();
            openDialog("schedule-dialog");
        }));
        document.querySelectorAll("[data-open-sos]").forEach((button) => button.addEventListener("click", () => {
            document.getElementById("sos-confirmation").textContent = "";
            renderReportStopOptions();
            openDialog("sos-dialog");
        }));

        document.getElementById("search-input").addEventListener("input", (event) => {
            searchValue = event.target.value;
            document.getElementById("clear-search").classList.toggle("is-visible", Boolean(searchValue));
            renderArrivals();
            renderRouteList();
            drawMap();
        });
        document.getElementById("clear-search").addEventListener("click", () => {
            const input = document.getElementById("search-input");
            input.value = "";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.focus();
        });

        const sidePanel = document.getElementById("side-panel");
        const sheetButton = document.getElementById("sheet-toggle");
        const toggleSheet = () => {
            const expanded = sidePanel.classList.toggle("is-open");
            sheetButton.setAttribute("aria-expanded", String(expanded));
            const label = currentRole === "administrador" ? "monitoramento das paradas" : "próximos ônibus";
            sheetButton.setAttribute("aria-label", (expanded ? "Fechar " : "Abrir ") + label);
        };
        if (sheetButton && sidePanel) sheetButton.addEventListener("click", toggleSheet);
        const fullMapToggle = document.getElementById("full-map-toggle");
        if (fullMapToggle) {
            fullMapToggle.addEventListener("click", () => {
                if (window.matchMedia("(max-width: 760px)").matches) {
                    toggleSheet();
                    return;
                }
                const layout = document.getElementById("dashboard-content");
                const expanded = layout.classList.toggle("is-map-expanded");
                fullMapToggle.querySelector(".button-label").textContent = expanded ? "Mostrar painel" : "Mapa completo";
                if (map) window.setTimeout(() => map.invalidateSize(), 240);
            });
        }

        document.getElementById("sos-report-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const description = document.getElementById("sos-description").value.trim();
            if (!description) return;
            const category = document.getElementById("sos-category-select").value;
            const stopId = document.getElementById("sos-stop-select").value || selectedStopId;
            addReport(category, description, stopId);
            document.getElementById("sos-description").value = "";
            document.getElementById("sos-confirmation").textContent = "Relato salvo no protótipo. A parada ficou vermelha no painel administrativo; nenhum serviço externo foi avisado.";
        });
        document.getElementById("sos-mark-stop").addEventListener("click", () => {
            const stopId = document.getElementById("sos-stop-select").value || selectedStopId;
            addReport("Ajuda", "Pedido de atenção enviado pela tela do usuário.", stopId);
            document.getElementById("sos-dialog").close();
        });

        const monitor = document.getElementById("stop-monitor-list");
        if (monitor) {
            monitor.addEventListener("change", (event) => {
                const stop = getStop(event.target.dataset.stopPeople || event.target.dataset.stopLevel);
                if (!stop) return;
                if (event.target.matches("[data-stop-people]")) {
                    stop.peopleCount = Math.max(0, Math.min(999, Math.round(Number(event.target.value) || 0)));
                } else if (event.target.matches("[data-stop-level]") && !stop.alertActive) {
                    stop.securityLevel = event.target.value;
                }
                saveState();
                renderAll();
            });
            monitor.addEventListener("click", (event) => {
                const button = event.target.closest("[data-monitor-action]");
                if (!button) return;
                const stop = getStop(button.dataset.stopId);
                if (!stop) return;
                if (button.dataset.monitorAction === "dismiss") {
                    stop.alertActive = false;
                    stop.securityLevel = "green";
                    saveState();
                    renderAll();
                    showToast("Alerta encerrado neste protótipo.");
                    return;
                }
                selectStop(stop.id, true);
            });
        }
    }

    function addReport(category, message, stopId) {
        const reportedStop = getStop(stopId || selectedStopId);
        if (reportedStop) {
            reportedStop.alertActive = true;
            reportedStop.securityLevel = "red";
            selectedStopId = reportedStop.id;
        }
        state.reports.unshift({
            id: createId("report"),
            category: String(category),
            message: String(message),
            lineId: selectedLineId,
            stopId: reportedStop?.id || selectedStopId,
            createdAt: new Date().toISOString()
        });
        state.reports = state.reports.slice(0, 100);
        saveState();
        renderAll();
        if (reportedStop) selectStop(reportedStop.id, true);
        showToast("Relato salvo e parada marcada em vermelho no protótipo.");
    }

    function displayTimes(line, key) {
        const schedules = line.schedules || DEFAULT_SCHEDULE;
        const values = Array.isArray(schedules[key]) ? schedules[key] : [];
        return values.length ? values.join(" · ") : "Sem horários cadastrados";
    }

    function renderScheduleTable() {
        const body = document.getElementById("schedule-table-body");
        body.replaceChildren();
        state.lines.forEach((line) => {
            const row = document.createElement("tr");
            ["Linha " + line.number + " · " + line.name, displayTimes(line, "weekdays"), displayTimes(line, "saturday"), displayTimes(line, "sunday")].forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.append(cell);
            });
            body.append(row);
        });
        if (!state.lines.length) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 4;
            cell.textContent = "Cadastre uma linha para exibir a grade horária.";
            row.append(cell);
            body.append(row);
        }
    }

    function init(role) {
        currentRole = role;
        const expected = role === "administrador" ? "administrador" : "usuario";
        if (sessionStorage.getItem("perfil") !== expected) {
            window.location.replace("login.html");
            return;
        }

        document.body.classList.toggle("is-admin", expected === "administrador");
        document.querySelectorAll(".admin-only").forEach((node) => {
            if (expected === "administrador") node.hidden = false;
        });
        const desktopAdminActions = document.querySelector(".admin-actions");
        const mobileAdminActions = document.querySelector(".admin-actions-mobile");
        if (desktopAdminActions) desktopAdminActions.hidden = expected !== "administrador";
        if (mobileAdminActions) mobileAdminActions.hidden = expected !== "administrador";

        loadState();
        selectedStopId = state.stops.some((stop) => stop.id === "terminal") ? "terminal" : (state.stops[0]?.id || "");
        selectedLineId = state.lines[0]?.id || "";
        bindCommonControls();
        initializeMap();
        renderAll();
        updateClock();
        updateWeather();
        window.setInterval(updateClock, 1000);
        window.setInterval(updateWeather, 15 * 60 * 1000);
        if (expected !== "administrador") window.setInterval(renderArrivals, 15000);

        window.addEventListener("storage", (event) => {
            if (event.key !== STORAGE_KEY || !event.newValue) return;
            try {
                state = normalizeState(JSON.parse(event.newValue));
                renderAll();
            } catch (error) {
                showToast("Não foi possível atualizar os dados deste dispositivo.");
            }
        });

        if (expected === "administrador" && window.TransitAdmin) window.TransitAdmin.init(api);
    }

    function logout() {
        sessionStorage.removeItem("perfil");
        window.location.replace("login.html");
    }

    const api = {
        init,
        getState: () => state,
        saveState,
        renderAll,
        drawMap,
        previewRoute,
        clearPreview: () => previewLayer?.clearLayers(),
        map: () => map,
        selectedLine: () => getLine(selectedLineId),
        selectLine,
        selectStop,
        createId,
        isCityCoordinate,
        safeColor,
        showToast,
        openDialog,
        closeDialog: (id) => document.getElementById(id)?.close()
    };

    window.TransitApp = api;
    window.sair = logout;
}());
