(function () {
    "use strict";

    let app = null;
    let routeOrder = [];
    let initialized = false;
    let lineForm;
    let stopForm;
    let placingStop = false;

    function state() {
        return app.getState();
    }

    function ensureStopOverview() {
        const layout = document.querySelector("#line-dialog .line-manager-layout");
        const routeColumn = element("line-manager-list")?.closest(".manager-list-column");
        const editor = document.querySelector("#line-dialog .editor-card");
        if (!layout || !routeColumn || !editor) return;
        routeColumn.classList.add("admin-lines-column");
        if (element("admin-stop-overview-card")) return;

        const panel = document.createElement("section");
        const heading = document.createElement("div");
        const title = document.createElement("h3");
        const manage = createButton("Gerenciar", "mini-button", () => openStopManager(), "Cadastrar ou editar paradas");
        const intro = document.createElement("p");
        const source = document.createElement("a");
        const geographySource = document.createElement("a");
        const list = document.createElement("div");
        panel.id = "admin-stop-overview-card";
        panel.className = "manager-list-column admin-stops-overview";
        panel.setAttribute("aria-label", "Resumo das paradas e referencias do prototipo");
        heading.className = "manager-list-header";
        title.textContent = "Paradas e referências";
        heading.append(title, manage);
        intro.className = "admin-overview-intro";
        intro.textContent = "Refer\u00eancias de bairro e itiner\u00e1rios p\u00fablicos (2024); n\u00e3o indicam o poste exato da parada.";
        source.className = "admin-overview-source";
        source.href = "https://www.agererechim.rs.gov.br/wp-content/uploads/2024/10/Empresa-de-Transportes-Gaurama-Ltda-__-Transporte-Coletivo-Urbano-de-Erechim-Busca-por-Bairro_.pdf";
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.textContent = "Consulta AGER de itiner\u00e1rios por bairro (2024)";
        geographySource.className = "admin-overview-source";
        geographySource.href = "https://www.teraserv.com.br/ferramentas/coordenadas-de-bairros/rs/erechim";
        geographySource.target = "_blank";
        geographySource.rel = "noopener noreferrer";
        geographySource.textContent = "Centroides de bairros · IBGE 2022";
        list.id = "admin-stop-overview";
        list.className = "stop-overview-list";
        panel.append(heading, intro, source, geographySource, list);
        layout.insertBefore(panel, editor);
    }

    function renderStopOverview() {
        const container = element("admin-stop-overview");
        if (!container || !initialized) return;
        container.replaceChildren();
        state().stops.forEach((stop) => {
            const item = document.createElement("div");
            const copy = document.createElement("span");
            const title = document.createElement("strong");
            const coordinates = document.createElement("small");
            const routes = document.createElement("span");
            const lineNumbers = state().lines.filter((line) => line.stopIds.includes(stop.id)).map((line) => line.number);
            item.className = "stop-overview-item";
            copy.className = "stop-overview-copy";
            title.textContent = stop.name;
            coordinates.textContent = Number(stop.lat).toFixed(4) + ", " + Number(stop.lng).toFixed(4) + " · aprox.";
            copy.append(title, coordinates);
            routes.className = "stop-overview-routes";
            routes.textContent = lineNumbers.length ? "Linhas " + lineNumbers.join(", ") : "Refer\u00eancia";
            item.append(copy, routes);
            container.append(item);
        });
    }

    function element(id) {
        return document.getElementById(id);
    }

    function createButton(label, className, action, ariaLabel) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.setAttribute("aria-label", ariaLabel || label);
        button.addEventListener("click", action);
        return button;
    }

    function renderLineManagerList() {
        const container = element("line-manager-list");
        if (!container || !initialized) return;
        container.replaceChildren();

        if (!state().lines.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "Nenhuma linha cadastrada. Crie uma linha para começar.";
            container.append(empty);
            return;
        }

        state().lines.forEach((line) => {
            const row = document.createElement("div");
            const main = document.createElement("span");
            const color = document.createElement("i");
            const text = document.createElement("span");
            const title = document.createElement("strong");
            const detail = document.createElement("small");
            const actions = document.createElement("span");

            row.className = "manager-list-item";
            main.className = "manager-list-main";
            color.className = "manager-color";
            color.style.backgroundColor = app.safeColor(line.color);
            title.textContent = "Linha " + line.number + " · " + line.name;
            detail.textContent = line.stopIds.length + " pontos no trajeto";
            text.append(title, detail);
            main.append(color, text);
            actions.className = "manager-item-actions";
            actions.append(
                createButton("Editar", "mini-button", () => editLine(line.id), "Editar linha " + line.number),
                createButton("Excluir", "mini-button danger", () => deleteLine(line.id), "Excluir linha " + line.number)
            );
            row.append(main, actions);
            container.append(row);
        });
    }

    function renderStopManagerList() {
        const container = element("stop-manager-list");
        if (!container || !initialized) return;
        container.replaceChildren();

        if (!state().stops.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "Nenhuma parada cadastrada.";
            container.append(empty);
            return;
        }

        state().stops.forEach((stop) => {
            const row = document.createElement("div");
            const main = document.createElement("span");
            const text = document.createElement("span");
            const title = document.createElement("strong");
            const detail = document.createElement("small");
            const actions = document.createElement("span");
            row.className = "manager-list-item";
            main.className = "manager-list-main";
            title.textContent = stop.name;
            detail.textContent = Number(stop.lat).toFixed(4) + ", " + Number(stop.lng).toFixed(4);
            text.append(title, detail);
            main.append(text);
            actions.className = "manager-item-actions";
            actions.append(
                createButton("Editar", "mini-button", () => editStop(stop.id), "Editar parada " + stop.name),
                createButton("Excluir", "mini-button danger", () => deleteStop(stop.id), "Excluir parada " + stop.name)
            );
            row.append(main, actions);
            container.append(row);
        });
    }

    function renderStopOptions() {
        const select = element("route-stop-select");
        if (!select || !initialized) return;
        const previous = select.value;
        select.replaceChildren();
        if (!state().stops.length) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Cadastre uma parada primeiro";
            select.append(option);
            return;
        }

        state().stops.forEach((stop) => {
            const option = document.createElement("option");
            option.value = stop.id;
            option.textContent = stop.name;
            select.append(option);
        });
        if (state().stops.some((stop) => stop.id === previous)) select.value = previous;
    }

    function renderRouteOrder() {
        const list = element("route-sequence-list");
        if (!list || !initialized) return;
        list.replaceChildren();

        if (!routeOrder.length) {
            const empty = document.createElement("li");
            empty.className = "coordinate-note";
            empty.textContent = "Adicione duas ou mais paradas para desenhar a rota.";
            list.append(empty);
            updateRoutePreview();
            return;
        }

        routeOrder.forEach((stopId, index) => {
            const stop = state().stops.find((candidate) => candidate.id === stopId);
            if (!stop) return;
            const item = document.createElement("li");
            const order = document.createElement("span");
            const name = document.createElement("span");
            const actions = document.createElement("span");
            item.className = "sequence-list-item";
            order.className = "sequence-index";
            order.textContent = String(index + 1);
            name.className = "sequence-stop-name";
            name.textContent = stop.name;
            actions.className = "sequence-actions";
            actions.append(
                createButton("↑", "mini-button", () => moveStop(index, -1), "Mover " + stop.name + " para cima"),
                createButton("↓", "mini-button", () => moveStop(index, 1), "Mover " + stop.name + " para baixo"),
                createButton("x", "mini-button danger", () => removeStopFromRoute(index), "Remover " + stop.name + " da rota")
            );
            item.append(order, name, actions);
            list.append(item);
        });
        updateRoutePreview();
    }

    function updateRoutePreview() {
        const id = element("line-id").value;
        const existing = state().lines.find((line) => line.id === id);
        const number = element("line-number").value.trim() || (existing ? existing.number : "Nova");
        const name = element("line-name").value.trim() || (existing ? existing.name : "Rota em edição");
        const color = element("line-color").value;
        app.previewRoute({ id: id || "draft", number, name, color, stopIds: routeOrder });
    }

    function moveStop(index, direction) {
        const target = index + direction;
        if (target < 0 || target >= routeOrder.length) return;
        const reordered = routeOrder.slice();
        [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
        routeOrder = reordered;
        renderRouteOrder();
    }

    function removeStopFromRoute(index) {
        routeOrder.splice(index, 1);
        renderRouteOrder();
    }

    function resetLineForm() {
        lineForm.reset();
        element("line-id").value = "";
        element("line-color").value = "#2563eb";
        element("line-form-heading").textContent = "Nova linha";
        element("line-form-error").textContent = "";
        routeOrder = [];
        renderStopOptions();
        renderRouteOrder();
    }

    function editLine(lineId) {
        const line = state().lines.find((candidate) => candidate.id === lineId);
        if (!line) return;
        element("line-id").value = line.id;
        element("line-number").value = line.number;
        element("line-name").value = line.name;
        element("line-color").value = app.safeColor(line.color);
        element("line-form-heading").textContent = "Editar linha " + line.number;
        element("line-form-error").textContent = "";
        routeOrder = line.stopIds.slice();
        renderStopOptions();
        renderRouteOrder();
    }

    function saveLine(event) {
        event.preventDefault();
        const id = element("line-id").value;
        const number = element("line-number").value.trim();
        const name = element("line-name").value.trim();
        const color = app.safeColor(element("line-color").value);
        const errorNode = element("line-form-error");
        const duplicate = state().lines.some((line) => line.number.toLocaleLowerCase() === number.toLocaleLowerCase() && line.id !== id);

        if (!number || !name) {
            errorNode.textContent = "Informe o número e o nome da linha.";
            return;
        }
        if (duplicate) {
            errorNode.textContent = "Já existe uma linha com esse número.";
            return;
        }
        if (routeOrder.filter((stopId) => state().stops.some((stop) => stop.id === stopId)).length < 2) {
            errorNode.textContent = "Adicione pelo menos duas paradas à rota.";
            return;
        }

        const existing = state().lines.find((line) => line.id === id);
        const line = {
            id: existing ? existing.id : app.createId("line"),
            number,
            name,
            color,
            stopIds: routeOrder.slice(),
            schedules: existing?.schedules || {
                weekdays: ["06:00", "07:00", "08:00", "12:00", "16:00", "18:00"],
                saturday: ["07:00", "09:00", "12:00", "16:00"],
                sunday: ["08:00", "12:00", "16:00"]
            },
            arrivalMinutes: existing?.arrivalMinutes || 8 + state().lines.length * 4
        };

        if (existing) {
            state().lines = state().lines.map((candidate) => candidate.id === existing.id ? line : candidate);
        } else {
            state().lines.push(line);
        }
        app.saveState();
        app.renderAll();
        app.selectLine(line.id, true);
        app.clearPreview();
        resetLineForm();
        app.showToast("Linha e sequência de paradas salvas neste dispositivo.");
    }

    function deleteLine(lineId) {
        const line = state().lines.find((candidate) => candidate.id === lineId);
        if (!line || !window.confirm("Excluir a linha " + line.number + " e seu roteiro?")) return;
        state().lines = state().lines.filter((candidate) => candidate.id !== lineId);
        app.saveState();
        app.renderAll();
        renderLineManagerList();
        resetLineForm();
        app.showToast("Linha excluída.");
    }

    function openLineManager() {
        renderLineManagerList();
        resetLineForm();
        app.clearPreview();
        app.openDialog("line-dialog");
    }

    function resetStopForm(coordinates) {
        stopForm.reset();
        element("stop-id").value = "";
        element("stop-form-heading").textContent = "Nova parada";
        element("stop-form-error").textContent = "";
        element("stop-coordinate-note").textContent = coordinates ? "Coordenadas capturadas no mapa; ajuste se necessário." : "As coordenadas iniciais são aproximadas.";
        if (coordinates) {
            element("stop-lat").value = coordinates.lat.toFixed(6);
            element("stop-lng").value = coordinates.lng.toFixed(6);
            window.requestAnimationFrame(() => element("stop-name").focus());
        }
    }

    function setStopPlacementMode(enabled) {
        const map = app.map();
        if (enabled && !map) {
            openStopManager();
            app.showToast("Sem mapa carregado: informe as coordenadas da parada no formulário.");
            return;
        }
        placingStop = enabled;
        if (enabled) {
            document.getElementById("side-panel")?.classList.remove("is-open");
            const sheetToggle = document.getElementById("sheet-toggle");
            sheetToggle?.setAttribute("aria-expanded", "false");
            sheetToggle?.setAttribute("aria-label", "Abrir monitoramento das paradas");
        }
        map?.getContainer().classList.toggle("is-placing-stop", enabled);
        document.querySelectorAll("[data-place-stop]").forEach((button) => {
            if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent;
            button.classList.toggle("is-active", enabled);
            button.setAttribute("aria-pressed", String(enabled));
            button.textContent = enabled ? "Clique no mapa… (Esc cancela)" : button.dataset.defaultLabel;
        });
        if (enabled) app.showToast("Clique no local da nova parada no mapa de Erechim.");
    }

    function editStop(stopId) {
        const stop = state().stops.find((candidate) => candidate.id === stopId);
        if (!stop) return;
        element("stop-id").value = stop.id;
        element("stop-name").value = stop.name;
        element("stop-lat").value = stop.lat;
        element("stop-lng").value = stop.lng;
        element("stop-form-heading").textContent = "Editar parada";
        element("stop-form-error").textContent = "";
        element("stop-coordinate-note").textContent = "Edite as coordenadas ou escolha outro ponto clicando no mapa.";
    }

    function saveStop(event) {
        event.preventDefault();
        const id = element("stop-id").value;
        const name = element("stop-name").value.trim();
        const lat = Number(element("stop-lat").value);
        const lng = Number(element("stop-lng").value);
        const errorNode = element("stop-form-error");
        const duplicate = state().stops.some((stop) => stop.name.toLocaleLowerCase() === name.toLocaleLowerCase() && stop.id !== id);

        if (!name) {
            errorNode.textContent = "Informe o nome da parada.";
            return;
        }
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            errorNode.textContent = "Informe coordenadas válidas.";
            return;
        }
        if (!app.isCityCoordinate(lat, lng)) {
            errorNode.textContent = "Escolha coordenadas dentro da área urbana do mapa de Erechim.";
            return;
        }
        if (duplicate) {
            errorNode.textContent = "Já existe uma parada com esse nome.";
            return;
        }

        const isNewStop = !id;
        const existing = state().stops.find((candidate) => candidate.id === id);
        const stop = {
            ...(existing || {}),
            id: existing ? existing.id : app.createId("stop"),
            name,
            lat,
            lng,
            reference: existing?.reference === true,
            neighborhood: existing?.neighborhood === true,
            peopleCount: Number.isFinite(Number(existing?.peopleCount)) ? existing.peopleCount : 0,
            securityLevel: existing?.securityLevel || "green",
            alertActive: existing?.alertActive === true
        };
        if (id) {
            state().stops = state().stops.map((candidate) => candidate.id === id ? stop : candidate);
        } else {
            state().stops.push(stop);
        }
        app.saveState();
        app.renderAll();
        renderStopManagerList();
        renderStopOptions();
        app.selectStop(stop.id, true);
        resetStopForm();
        if (isNewStop) element("stop-dialog").close();
        app.showToast("Parada salva neste dispositivo.");
    }

    function deleteStop(stopId) {
        const stop = state().stops.find((candidate) => candidate.id === stopId);
        if (!stop || !window.confirm("Excluir " + stop.name + "? Ela será removida das rotas cadastradas.")) return;
        state().stops = state().stops.filter((candidate) => candidate.id !== stopId);
        state().lines.forEach((line) => { line.stopIds = line.stopIds.filter((id) => id !== stopId); });
        app.saveState();
        app.renderAll();
        renderStopManagerList();
        renderStopOptions();
        resetStopForm();
        app.showToast("Parada excluída das linhas e do cadastro.");
    }

    function openStopManager(coordinates) {
        renderStopManagerList();
        renderStopOptions();
        resetStopForm(coordinates);
        app.clearPreview();
        app.openDialog("stop-dialog");
    }

    function refresh() {
        if (!initialized) return;
        renderLineManagerList();
        renderStopManagerList();
        renderStopOverview();
        renderStopOptions();
        if (element("line-id").value) {
            routeOrder = routeOrder.filter((id) => state().stops.some((stop) => stop.id === id));
            renderRouteOrder();
        }
    }

    function init(transitApp) {
        app = transitApp;
        if (sessionStorage.getItem("perfil") !== "administrador") {
            window.location.replace("login.html");
            return;
        }

        lineForm = element("line-form");
        stopForm = element("stop-form");
        initialized = true;
        ensureStopOverview();
        const adminIntro = document.querySelector("#line-dialog .dialog-header p");
        if (adminIntro) adminIntro.textContent = "Prot\u00f3tipo acad\u00eamico · linhas, paradas e coordenadas para demonstra\u00e7\u00e3o.";
        const stopIntro = document.querySelector("#stop-dialog .dialog-header p");
        if (stopIntro) stopIntro.textContent = "Cadastre uma parada e informe as coordenadas aproximadas usadas neste prot\u00f3tipo.";
        renderLineManagerList();
        renderStopManagerList();
        renderStopOverview();
        renderStopOptions();
        renderRouteOrder();

        document.querySelectorAll("[data-open-lines]").forEach((button) => button.addEventListener("click", openLineManager));
        document.querySelectorAll("[data-open-stops]").forEach((button) => button.addEventListener("click", () => openStopManager()));
        document.querySelectorAll("[data-place-stop]").forEach((button) => button.addEventListener("click", () => setStopPlacementMode(!placingStop)));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && placingStop) {
                setStopPlacementMode(false);
                app.showToast("Seleção do ponto cancelada.");
            }
        });
        element("new-line").addEventListener("click", resetLineForm);
        element("cancel-line-edit").addEventListener("click", resetLineForm);
        element("line-form").addEventListener("submit", saveLine);
        element("route-stop-select").addEventListener("change", updateRoutePreview);
        element("line-number").addEventListener("input", updateRoutePreview);
        element("line-name").addEventListener("input", updateRoutePreview);
        element("line-color").addEventListener("input", updateRoutePreview);
        element("add-route-stop").addEventListener("click", () => {
            const stopId = element("route-stop-select").value;
            if (!stopId) return;
            routeOrder.push(stopId);
            renderRouteOrder();
        });

        element("new-stop").addEventListener("click", () => resetStopForm());
        element("cancel-stop-edit").addEventListener("click", () => resetStopForm());
        element("stop-form").addEventListener("submit", saveStop);
        element("stop-dialog").addEventListener("close", () => app.clearPreview());
        element("line-dialog").addEventListener("close", () => app.clearPreview());
        element("line-dialog").addEventListener("cancel", (event) => event.preventDefault());

        const map = app.map();
        if (map) {
            map.on("click", (event) => {
                if (!placingStop) return;
                const coordinates = { lat: event.latlng.lat, lng: event.latlng.lng };
                if (!app.isCityCoordinate(coordinates.lat, coordinates.lng)) {
                    app.showToast("Escolha um ponto dentro da área urbana do mapa.");
                    return;
                }
                setStopPlacementMode(false);
                openStopManager(coordinates);
            });
        }

    }

    window.TransitAdmin = { init, refresh };
    if (window.TransitApp) window.TransitApp.init("administrador");
}());
