(() => {
  "use strict";

  const API_VERSION = "1.12.1";

  const FAVORITE_GROUPS = [
    {
      path: "Cars/BMW/E46",
      items: [
        {
          uid: "d9bfd8126e754164b48ded833c017bbf",
          title: "Low Poly BMW E46 1998",
          url: "https://sketchfab.com/3d-models/low-poly-car-bmw-e46-1998-d9bfd8126e754164b48ded833c017bbf"
        },
        {
          uid: "f5f00aecf89845709d02be03a8007752",
          title: "BMW M3 Coupe E46",
          url: "https://sketchfab.com/3d-models/bmw-m3-coupe-e46-f5f00aecf89845709d02be03a8007752"
        },
        {
          uid: "7dbc5efdd9844b7bb13f0ede844c5ed2",
          title: "BMW E46 330d Gearbox",
          url: "https://sketchfab.com/3d-models/bmw-e46-330d-gearbox-7dbc5efdd9844b7bb13f0ede844c5ed2"
        },
        {
          uid: "f748691459b34b8b8e8f0cb1e09925a2",
          title: "E46 Rear Crossmember / Subframe",
          url: "https://sketchfab.com/3d-models/bmw-e46-rear-crossmember-subframe-stock-m3-f748691459b34b8b8e8f0cb1e09925a2"
        },
        {
          uid: "4fcff8ef8e31483d85a044ae5142850e",
          title: "BMW E46 M3 CSL",
          url: "https://sketchfab.com/3d-models/bmw-e46-m3-csl-4fcff8ef8e31483d85a044ae5142850e"
        },
        {
          uid: "007fd1a8f561420bb3dadffbfce4b4cc",
          title: "Low Poly BMW E46",
          url: "https://sketchfab.com/3d-models/low-poly-bmw-e46-007fd1a8f561420bb3dadffbfce4b4cc"
        },
        {
          uid: "7aa3ddcdff9f40fea35331255062038d",
          title: "BMW 318ti E46 Compact",
          url: "https://sketchfab.com/3d-models/bmw-318ti-e46-compact-7aa3ddcdff9f40fea35331255062038d"
        },
        {
          uid: "894b0e5cc5404646988521d0255552f0",
          title: "BMW E46 3 Series",
          url: "https://sketchfab.com/3d-models/bmw-e46-3-series-894b0e5cc5404646988521d0255552f0"
        },
        {
          uid: "7846a8c9431648c1857546632c8ffa3c",
          title: "BMW 3 Series E46 (1998–2002)",
          url: "https://sketchfab.com/3d-models/bmw-3-series-e46-1998-2002-7846a8c9431648c1857546632c8ffa3c"
        },
        {
          uid: "2e32a3e273ab482b83970603539de06a",
          title: "BMW 3 Series E46 (1998–2006)",
          url: "https://sketchfab.com/3d-models/bmw-3-series-e46-1998-2006-2e32a3e273ab482b83970603539de06a"
        }
      ]
    },
    {
      path: "Cars/Fiat",
      items: [
        {
          uid: "784e95f4f22545199be7e165af6437f8",
          title: "FIAT APOC",
          url: "https://sketchfab.com/3d-models/fiat-apoc-784e95f4f22545199be7e165af6437f8"
        }
      ]
    },
    {
      path: "Electronics/Apple/Mac Mini",
      items: [
        {
          uid: "fbfe1d9214bd40818755fe6d05b4afec",
          title: "Apple Mac Mini (Element 3D)",
          url: "https://sketchfab.com/3d-models/apple-mac-mini-for-element-3d-fbfe1d9214bd40818755fe6d05b4afec"
        },
        {
          uid: "88b82a8b48234bf89da547181139451a",
          title: "Apple Mac Mini M4",
          url: "https://sketchfab.com/3d-models/apple-mac-mini-m4-88b82a8b48234bf89da547181139451a"
        },
        {
          uid: "3d1306e5b4f849a38f9229ad81dbbc5f",
          title: "Mac Mini",
          url: "https://sketchfab.com/3d-models/mac-mini-3d1306e5b4f849a38f9229ad81dbbc5f"
        },
        {
          uid: "7c88a90cea87413f85bc5ef2dfeac2b7",
          title: "Daily Challenge 04 — Mac Mini",
          url: "https://sketchfab.com/3d-models/daily-3d-challenge-04-mac-mini-7c88a90cea87413f85bc5ef2dfeac2b7"
        }
      ]
    }
  ];

  const FAVORITES = FAVORITE_GROUPS.flatMap((group) =>
    group.items.map((item) => Object.assign({ group: group.path }, item))
  );

  const state = {
    api: null,
    uid: FAVORITES[0].uid,
    title: FAVORITES[0].title,
    pickMode: "select",
    spinning: false,
    wireframe: false,
    postFx: false,
    bgDark: true,
    nodesById: {},
    officialNodes: [],
    hiddenIds: new Set(),
    selectedId: null,
    matrixBackup: {},
    materials: [],
    annotationCount: 0,
    soloPrevHidden: null
  };

  const el = {
    favoriteSelect: document.getElementById("favoriteSelect"),
    modelInput: document.getElementById("modelInput"),
    loadForm: document.getElementById("loadForm"),
    viewerHost: document.getElementById("viewerHost"),
    loadStatus: document.getElementById("loadStatus"),
    navTree: document.getElementById("navTree"),
    nodeFilter: document.getElementById("nodeFilter"),
    pickMode: document.getElementById("pickMode"),
    sideTabs: document.getElementById("sideTabs"),
    selectionEmpty: document.getElementById("selectionEmpty"),
    selectionPanel: document.getElementById("selectionPanel"),
    selName: document.getElementById("selName"),
    selId: document.getElementById("selId"),
    selType: document.getElementById("selType"),
    selParent: document.getElementById("selParent"),
    selChildren: document.getElementById("selChildren"),
    materialList: document.getElementById("materialList"),
    annotationList: document.getElementById("annotationList"),
    infoTitle: document.getElementById("infoTitle"),
    infoUid: document.getElementById("infoUid"),
    infoNodes: document.getElementById("infoNodes"),
    infoMaterials: document.getElementById("infoMaterials"),
    eventLog: document.getElementById("eventLog"),
    fovRange: document.getElementById("fovRange")
  };

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    el.eventLog.textContent = `[${stamp}] ${message}\n` + el.eventLog.textContent;
  }

  function setStatus(text) {
    el.loadStatus.textContent = text;
  }

  function extractUid(raw) {
    const value = String(raw || "").trim();
    if (!value) return null;
    const fromPath = value.match(/([a-f0-9]{32})(?:\/)?(?:\?.*)?$/i);
    if (fromPath) return fromPath[1].toLowerCase();
    if (/^[a-f0-9]{32}$/i.test(value)) return value.toLowerCase();
    try {
      const url = new URL(value);
      const q = url.searchParams.get("id");
      if (q && /^[a-f0-9]{32}$/i.test(q)) return q.toLowerCase();
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  function favoriteByUid(uid) {
    return FAVORITES.find((item) => item.uid === uid) || null;
  }

  function populateFavorites() {
    const groupsHtml = FAVORITE_GROUPS.map((group) => {
      const options = group.items
        .map((item) => `<option value="${item.uid}">${item.title}</option>`)
        .join("");
      return `<optgroup label="${group.path}">${options}</optgroup>`;
    }).join("");

    el.favoriteSelect.innerHTML =
      `<option value="">Eigenes Modell…</option>` + groupsHtml;
  }

  function syncUrl(uid) {
    const next = new URL(window.location.href);
    next.searchParams.set("id", uid);
    window.history.replaceState({}, "", next);
  }

  function switchTab(name) {
    document.querySelectorAll(".tabs button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.tab === name);
    });
    document.querySelectorAll(".panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === name);
    });
  }

  function createViewerFrame() {
    el.viewerHost.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.id = "api-frame";
    iframe.title = "Sketchfab Viewer";
    iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("mozallowfullscreen", "true");
    iframe.setAttribute("webkitallowfullscreen", "true");
    el.viewerHost.appendChild(iframe);
    return iframe;
  }

  function loadModel(uid, titleHint) {
    const clean = extractUid(uid);
    if (!clean) {
      setStatus("Ungültige URL/UID");
      log("Konnte keine UID aus Eingabe lesen");
      return;
    }

    const fav = favoriteByUid(clean);
    state.uid = clean;
    state.title = titleHint || (fav && fav.title) || clean;
    state.api = null;
    state.nodesById = {};
    state.officialNodes = [];
    state.hiddenIds = new Set();
    state.selectedId = null;
    state.matrixBackup = {};
    state.materials = [];
    state.annotationCount = 0;
    state.soloPrevHidden = null;
    state.spinning = false;
    state.wireframe = false;
    state.postFx = false;

    el.favoriteSelect.value = fav ? fav.uid : "";
    el.modelInput.value = fav ? fav.url : clean;
    el.navTree.innerHTML = "";
    el.materialList.innerHTML = "";
    el.annotationList.innerHTML = "";
    el.selectionPanel.classList.add("hidden");
    el.selectionEmpty.style.display = "";
    updateInfo();
    syncUrl(clean);
    setStatus("Lade Modell…");
    log(`Init ${state.title} (${clean})`);

    const iframe = createViewerFrame();
    const client = new window.Sketchfab(API_VERSION, iframe);
    client.init(clean, {
      success: onSuccess,
      error: () => {
        setStatus("API-Fehler");
        log("Sketchfab API error / Modell nicht ladbar");
      },
      autostart: 1,
      preload: 1,
      autospin: 0,
      transparent: 1,
      ui_theme: "dark",
      ui_inspector: 1,
      ui_annotations: 1,
      ui_controls: 1,
      ui_watermark: 1,
      ui_infos: 1,
      ui_stop: 0,
      ui_help: 0,
      ui_settings: 0,
      ui_vr: 0,
      ui_ar: 0,
      ui_fullscreen: 1,
      camera: 1,
      merge_materials: 0
    });
  }

  function onSuccess(api) {
    state.api = api;
    api.start(() => {
      api.addEventListener("modelLoadProgress", (progress) => {
        const pct = Math.round((progress || 0) * 100);
        setStatus(`Lade… ${pct}%`);
      });

      api.addEventListener("viewerready", () => {
        setStatus("Viewer bereit");
        log("viewerready");
        setupViewer(api);
      });
    });
  }

  function setupViewer(api) {
    api.setHighlightOptions(
      {
        outlineWidth: 4,
        outlineColor: [0.94, 0.63, 0.01, 1],
        outlineDuration: 2,
        highlightColor: [0.89, 0.34, 0.18, 0.35],
        highlightDuration: 2
      },
      () => log("Highlight-Optionen gesetzt")
    );

    api.setBackground({ color: [0.05, 0.05, 0.04] }, () => {});
    api.getFov((err, fov) => {
      if (!err && typeof fov === "number") el.fovRange.value = String(Math.round(fov));
    });

    api.addEventListener(
      "click",
      (info) => {
        if (!info || info.instanceID == null) {
          log("Klick ohne Hit");
          return;
        }
        handlePick(info);
      },
      { pick: "fast" }
    );

    api.addEventListener("nodeMouseEnter", (info) => {
      if (info && info.instanceID != null) {
        const node = state.nodesById[info.instanceID];
        if (node) setStatus(`Hover: ${node.name || info.instanceID}`);
      }
    });

    buildNodeTree(api);
    loadMaterials(api);
    refreshAnnotations(api);
    updateInfo();
  }

  function resolveMatrixNode(instanceID) {
    let node = state.nodesById[instanceID];
    if (!node) return null;
    if (node.type === "MatrixTransform") return node;

    // Climb to nearest MatrixTransform parent for show/hide/transform.
    let current = node;
    const guard = new Set();
    while (current && !guard.has(current.instanceID)) {
      guard.add(current.instanceID);
      if (current.type === "MatrixTransform") return current;
      const parentId = current.parent != null ? current.parent : current.parentID;
      if (parentId == null) break;
      current = state.nodesById[parentId];
    }
    return node;
  }

  function handlePick(info) {
    const resolved = resolveMatrixNode(info.instanceID) || state.nodesById[info.instanceID];
    const id = resolved ? resolved.instanceID : info.instanceID;

    if (info.material) {
      try {
        state.api.highlightMaterial(info.material);
      } catch (_) {
        /* optional */
      }
    }

    if (state.pickMode === "annotate") {
      placeAnnotation(info);
      return;
    }

    selectNode(id);

    if (state.pickMode === "toggle") {
      if (state.hiddenIds.has(id)) showNode(id);
      else hideNode(id);
    }
  }

  function placeAnnotation(info) {
    const api = state.api;
    if (!api || !info.position3D) return;

    api.getCameraLookAt((err, camera) => {
      const eye = err ? [0, -5, 2] : camera.position;
      const target = err ? info.position3D : camera.target;
      const title = `Pin ${state.annotationCount + 1}`;
      const text = `Node ${info.instanceID}`;
      api.createAnnotationFromWorldPosition(
        info.position3D,
        eye,
        target,
        title,
        text,
        (createErr, index) => {
          if (createErr) {
            log("Annotation fehlgeschlagen");
            return;
          }
          state.annotationCount += 1;
          log(`Annotation #${index + 1} gesetzt`);
          refreshAnnotations(api);
          switchTab("annotations");
        }
      );
    });
  }

  function buildNodeTree(api) {
    api.getNodeMap((err, nodes) => {
      if (err || !nodes) {
        log("getNodeMap fehlgeschlagen");
        setStatus("Keine Nodes");
        return;
      }

      state.nodesById = nodes;
      state.officialNodes = [];

      let root =
        Object.values(nodes).find((n) => n.name === "RootNode") ||
        Object.values(nodes).find((n) => n.name === "root");

      if (!root) {
        // Fallback: first MatrixTransform without parent
        root = Object.values(nodes).find(
          (n) => n.type === "MatrixTransform" && (n.parent == null || n.parent === -1)
        );
      }

      if (!root) {
        el.navTree.innerHTML = "<p class='empty'>Kein Scene-Root gefunden.</p>";
        log("Kein RootNode/root gefunden");
        return;
      }

      recurse(root, (root.children && root.children.length) || 0, 0);
      generateTree();
      updateInfo();
      log(`Nodes indexiert: ${Object.keys(nodes).length}, Tree: ${state.officialNodes.length}`);
      setStatus(`${state.officialNodes.length} Teile`);
    });
  }

  function isParent(children) {
    if (!children || !children.length) return false;
    return children.some((child) => child.type === "MatrixTransform");
  }

  function recurse(nodeTree, childCount, theParentID) {
    if (!nodeTree || !nodeTree.children) return;
    for (let i = 0; i < childCount; i++) {
      const child = nodeTree.children[i];
      if (!child || child.type !== "MatrixTransform") continue;

      const node = {
        name: child.name || `noname_${child.instanceID}`,
        type: child.type,
        instanceID: child.instanceID,
        isParent: isParent(child.children),
        parentID: theParentID || null
      };
      state.officialNodes.push(node);
      recurse(child, (child.children && child.children.length) || 0, child.instanceID);
    }
  }

  function unflatten(arr) {
    const tree = [];
    const mapped = {};

    arr.forEach((item) => {
      mapped[item.instanceID] = Object.assign({}, item, { children: [] });
    });

    Object.keys(mapped).forEach((id) => {
      const node = mapped[id];
      if (node.parentID && mapped[node.parentID]) {
        mapped[node.parentID].children.push(node);
      } else {
        tree.push(node);
      }
    });
    return tree;
  }

  function createButton(btnType, instance, name) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = btnType;
    btn.value = String(instance);
    btn.dataset.instance = String(instance);
    btn.textContent = btnType;
    if (btnType === "Hide") {
      btn.id = `${instance}_${name}_Hide`;
      if (state.hiddenIds.has(instance)) btn.classList.add("is-off");
    } else {
      btn.id = `${instance}_${name}`;
    }
    return btn;
  }

  function toUl(branches, setID, setClass) {
    const outer = document.createElement("ul");
    if (setID) outer.id = setID;
    if (setClass) outer.className = setClass;

    branches.forEach((branch) => {
      const li = document.createElement("li");
      const row = document.createElement("div");
      row.className = "node-row";
      row.dataset.instance = String(branch.instanceID);
      row.dataset.name = (branch.name || "").toLowerCase();

      const label = document.createElement("span");
      label.className = branch.isParent ? "caret" : "caret_child";
      let text = String(branch.name || "unnamed").replace(/_/g, " ");
      if (text.length > 28) text = text.slice(0, 28) + "…";
      label.textContent = text;
      label.title = branch.name || "";

      row.appendChild(label);
      row.appendChild(createButton("Hide", branch.instanceID, branch.name));
      row.appendChild(createButton("Show", branch.instanceID, branch.name));
      li.appendChild(row);

      if (branch.children && branch.children.length) {
        li.appendChild(toUl(branch.children, String(branch.instanceID), "nested"));
      }
      outer.appendChild(li);
    });

    return outer;
  }

  function generateTree() {
    const tree = unflatten(state.officialNodes);
    el.navTree.innerHTML = "";
    el.navTree.appendChild(toUl(tree, "myUL"));

    el.navTree.querySelectorAll(".caret").forEach((caret) => {
      caret.addEventListener("click", (event) => {
        event.stopPropagation();
        const nested = caret.parentElement.parentElement.querySelector(":scope > .nested");
        if (!nested) return;
        nested.classList.toggle("active");
        caret.classList.toggle("caret-down");
      });
    });

    el.navTree.querySelectorAll(".node-row").forEach((row) => {
      row.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;
        selectNode(Number(row.dataset.instance));
      });
    });

    el.navTree.querySelectorAll("button.Hide").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        hideNode(Number(btn.value));
      });
    });

    el.navTree.querySelectorAll("button.Show").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        showNode(Number(btn.value));
      });
    });
  }

  function collectDescendants(instanceID) {
    const ids = [instanceID];
    const queue = [instanceID];
    while (queue.length) {
      const current = queue.shift();
      state.officialNodes.forEach((node) => {
        if (node.parentID === current) {
          ids.push(node.instanceID);
          queue.push(node.instanceID);
        }
      });
    }
    return ids;
  }

  function collectAncestors(instanceID) {
    const ids = [];
    const byId = {};
    state.officialNodes.forEach((node) => {
      byId[node.instanceID] = node;
    });
    let current = byId[instanceID];
    const guard = new Set();
    while (current && current.parentID && !guard.has(current.parentID)) {
      guard.add(current.parentID);
      ids.push(current.parentID);
      current = byId[current.parentID];
    }
    return ids;
  }

  function markHiddenUi(instanceID, hidden) {
    collectDescendants(instanceID).forEach((id) => {
      if (hidden) state.hiddenIds.add(id);
      else state.hiddenIds.delete(id);

      const hideBtn = el.navTree.querySelector(`button.Hide[data-instance="${id}"]`);
      if (hideBtn) hideBtn.classList.toggle("is-off", hidden);
      const row = el.navTree.querySelector(`.node-row[data-instance="${id}"]`);
      if (row) row.classList.toggle("is-hidden-state", hidden);
    });
  }

  function hideNode(instanceID) {
    if (!state.api) return;
    const ids = collectDescendants(instanceID);
    ids.forEach((id) => state.api.hide(id));
    markHiddenUi(instanceID, true);
    log(`hide ${instanceID} (+${ids.length - 1} Kinder)`);
  }

  function showNode(instanceID) {
    if (!state.api) return;
    const ids = collectDescendants(instanceID);
    ids.forEach((id) => state.api.show(id));
    markHiddenUi(instanceID, false);
    log(`show ${instanceID} (+${ids.length - 1} Kinder)`);
  }

  function showAllNodes() {
    state.officialNodes.forEach((node) => {
      if (state.api) state.api.show(node.instanceID);
    });
    state.hiddenIds.clear();
    el.navTree.querySelectorAll("button.Hide").forEach((btn) => btn.classList.remove("is-off"));
    el.navTree.querySelectorAll(".node-row").forEach((row) => row.classList.remove("is-hidden-state"));
    log("Alle Nodes sichtbar");
  }

  function selectNode(instanceID) {
    const node = state.nodesById[instanceID] || state.officialNodes.find((n) => n.instanceID === instanceID);
    if (!node) {
      log(`Node ${instanceID} nicht gefunden`);
      return;
    }

    state.selectedId = instanceID;
    el.navTree.querySelectorAll(".node-row").forEach((row) => {
      row.classList.toggle("is-selected", Number(row.dataset.instance) === instanceID);
    });

    const selectedRow = el.navTree.querySelector(`.node-row[data-instance="${instanceID}"]`);
    if (selectedRow) {
      selectedRow.scrollIntoView({ block: "nearest" });
      // Expand ancestors
      let parent = selectedRow.parentElement;
      while (parent) {
        if (parent.classList && parent.classList.contains("nested")) {
          parent.classList.add("active");
          const caret = parent.parentElement && parent.parentElement.querySelector(":scope > .node-row .caret");
          if (caret) caret.classList.add("caret-down");
        }
        parent = parent.parentElement;
      }
    }

    el.selectionEmpty.style.display = "none";
    el.selectionPanel.classList.remove("hidden");
    el.selName.textContent = node.name || `Node ${instanceID}`;
    el.selId.textContent = String(instanceID);
    el.selType.textContent = node.type || "—";

    const official = state.officialNodes.find((n) => n.instanceID === instanceID);
    const parentId = official ? official.parentID : node.parent;
    const parentNode = parentId ? state.nodesById[parentId] : null;
    el.selParent.textContent = parentNode ? parentNode.name || parentId : "—";
    const childCount = collectDescendants(instanceID).length - 1;
    el.selChildren.textContent = String(childCount);

    if (!state.matrixBackup[instanceID] && state.api && node.type === "MatrixTransform") {
      state.api.getMatrix(instanceID, (err, matrix) => {
        if (!err && matrix) state.matrixBackup[instanceID] = matrix.slice();
      });
    }

    log(`Auswahl: ${node.name || instanceID}`);
  }

  function setNodeVisibility(instanceID, visible) {
    if (!state.api) return;
    if (visible) {
      state.api.show(instanceID);
      state.hiddenIds.delete(instanceID);
    } else {
      state.api.hide(instanceID);
      state.hiddenIds.add(instanceID);
    }
    const hideBtn = el.navTree.querySelector(`button.Hide[data-instance="${instanceID}"]`);
    if (hideBtn) hideBtn.classList.toggle("is-off", !visible);
    const row = el.navTree.querySelector(`.node-row[data-instance="${instanceID}"]`);
    if (row) row.classList.toggle("is-hidden-state", !visible);
  }

  function soloSelection() {
    if (state.selectedId == null) return;
    if (!state.soloPrevHidden) {
      state.soloPrevHidden = new Set(state.hiddenIds);
      const keep = new Set([
        ...collectAncestors(state.selectedId),
        ...collectDescendants(state.selectedId)
      ]);
      // Per-node visibility only — cascading show/hide would re-open siblings.
      state.officialNodes.forEach((node) => {
        setNodeVisibility(node.instanceID, keep.has(node.instanceID));
      });
      log("Solo-Modus an");
    } else {
      const previousHidden = state.soloPrevHidden;
      state.officialNodes.forEach((node) => {
        setNodeVisibility(node.instanceID, !previousHidden.has(node.instanceID));
      });
      state.soloPrevHidden = null;
      log("Solo-Modus aus");
    }
  }

  function nudgeSelected(axis, dir) {
    const api = state.api;
    const id = state.selectedId;
    if (!api || id == null) return;
    const delta = 0.05 * dir;
    const offset = [0, 0, 0];
    const idx = { x: 0, y: 1, z: 2 }[axis];
    offset[idx] = delta;

    api.getMatrix(id, (err, matrix) => {
      if (err || !matrix) {
        log("getMatrix fehlgeschlagen");
        return;
      }
      if (!state.matrixBackup[id]) state.matrixBackup[id] = matrix.slice();
      const next = matrix.slice();
      next[12] += offset[0];
      next[13] += offset[1];
      next[14] += offset[2];
      api.setMatrix(id, next, (setErr) => {
        if (setErr) log("setMatrix fehlgeschlagen");
        else log(`translate ${axis} ${dir > 0 ? "+" : "-"}`);
      });
    });
  }

  function rotateSelected(axis, dir) {
    const api = state.api;
    const id = state.selectedId;
    if (!api || id == null) return;
    const angle = (8 * Math.PI) / 180 * dir;
    const axisVec = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[axis];
    api.getMatrix(id, (err, matrix) => {
      if (!err && matrix && !state.matrixBackup[id]) state.matrixBackup[id] = matrix.slice();
      api.rotate(id, [angle, axisVec[0], axisVec[1], axisVec[2]], { duration: 0.25, easing: "easeOutQuad" }, (rotErr) => {
        if (rotErr) log("rotate fehlgeschlagen (nur MatrixTransform)");
        else log(`rotate ${axis}`);
      });
    });
  }

  function resetSelectedMatrix() {
    const api = state.api;
    const id = state.selectedId;
    if (!api || id == null) return;
    const backup = state.matrixBackup[id];
    if (!backup) {
      log("Kein Matrix-Backup");
      return;
    }
    api.setMatrix(id, backup, (err) => {
      if (err) log("Reset fehlgeschlagen");
      else log("Matrix zurückgesetzt");
    });
  }

  function loadMaterials(api) {
    api.getMaterialList((err, materials) => {
      if (err || !materials) {
        el.materialList.innerHTML = "<li>Keine Materialien</li>";
        return;
      }
      state.materials = materials;
      el.materialList.innerHTML = "";
      materials.forEach((mat, index) => {
        const li = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = mat.name || `Material ${index + 1}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Highlight";
        btn.addEventListener("click", () => {
          api.setHighlightOptions(
            {
              outlineWidth: 3,
              outlineColor: [0.23, 0.49, 0.87, 1],
              outlineDuration: 2,
              highlightColor: [0.23, 0.49, 0.87, 0.35],
              highlightDuration: 2
            },
            () => {
              api.highlightMaterial(mat);
              log(`Material highlight: ${mat.name || index}`);
            }
          );
        });
        li.appendChild(name);
        li.appendChild(btn);
        el.materialList.appendChild(li);
      });
      updateInfo();
      log(`Materials: ${materials.length}`);
    });
  }

  function refreshAnnotations(api) {
    api.getAnnotationList((err, list) => {
      el.annotationList.innerHTML = "";
      if (err || !list || !list.length) {
        el.annotationList.innerHTML = "<li class='empty'>Keine Annotations</li>";
        return;
      }
      list.forEach((anno, index) => {
        const li = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = `${index + 1}. ${anno.title || "Note"}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Goto";
        btn.addEventListener("click", () => {
          api.gotoAnnotation(index, { preventCameraAnimation: false }, () => log(`goto annotation ${index + 1}`));
        });
        li.appendChild(label);
        li.appendChild(btn);
        el.annotationList.appendChild(li);
      });
    });
  }

  function updateInfo() {
    el.infoTitle.textContent = state.title || "—";
    el.infoUid.textContent = state.uid || "—";
    el.infoNodes.textContent = String(state.officialNodes.length || Object.keys(state.nodesById).length || 0);
    el.infoMaterials.textContent = String(state.materials.length);
  }

  function filterNodes(query) {
    const q = query.trim().toLowerCase();
    el.navTree.querySelectorAll(".node-row").forEach((row) => {
      const match = !q || (row.dataset.name || "").includes(q);
      row.classList.toggle("is-filtered-out", !match);
      if (match && q) {
        let parent = row.parentElement;
        while (parent) {
          if (parent.classList && parent.classList.contains("nested")) {
            parent.classList.add("active");
            const caret = parent.parentElement && parent.parentElement.querySelector(":scope > .node-row .caret");
            if (caret) caret.classList.add("caret-down");
          }
          parent = parent.parentElement;
        }
      }
    });
  }

  function setExpandAll(open) {
    el.navTree.querySelectorAll(".nested").forEach((node) => {
      node.classList.toggle("active", open);
    });
    el.navTree.querySelectorAll(".caret").forEach((caret) => {
      caret.classList.toggle("caret-down", open);
    });
  }

  function bindUi() {
    populateFavorites();

    el.loadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fromInput = el.modelInput.value.trim();
      const uid = extractUid(fromInput) || el.favoriteSelect.value;
      const fav = favoriteByUid(uid);
      loadModel(uid, fav && fav.title);
    });

    el.favoriteSelect.addEventListener("change", () => {
      const fav = favoriteByUid(el.favoriteSelect.value);
      if (!fav) return;
      el.modelInput.value = fav.url;
      loadModel(fav.uid, fav.title);
    });

    el.pickMode.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-mode]");
      if (!btn) return;
      state.pickMode = btn.dataset.mode;
      el.pickMode.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === btn));
      log(`Pick-Modus: ${state.pickMode}`);
    });

    el.sideTabs.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-tab]");
      if (!btn) return;
      switchTab(btn.dataset.tab);
    });

    el.nodeFilter.addEventListener("input", () => filterNodes(el.nodeFilter.value));
    document.getElementById("btnExpandAll").addEventListener("click", () => setExpandAll(true));
    document.getElementById("btnCollapseAll").addEventListener("click", () => setExpandAll(false));
    document.getElementById("btnShowAll").addEventListener("click", showAllNodes);

    document.getElementById("btnSelShow").addEventListener("click", () => {
      if (state.selectedId != null) showNode(state.selectedId);
    });
    document.getElementById("btnSelHide").addEventListener("click", () => {
      if (state.selectedId != null) hideNode(state.selectedId);
    });
    document.getElementById("btnSelSolo").addEventListener("click", soloSelection);
    document.getElementById("btnSelReset").addEventListener("click", resetSelectedMatrix);

    document.querySelectorAll(".nudge-btn").forEach((btn) => {
      btn.addEventListener("click", () => nudgeSelected(btn.dataset.axis, Number(btn.dataset.dir)));
    });
    document.querySelectorAll(".rotate-btn").forEach((btn) => {
      btn.addEventListener("click", () => rotateSelected(btn.dataset.rot, Number(btn.dataset.dir)));
    });

    document.getElementById("btnRecenter").addEventListener("click", () => {
      if (!state.api) return;
      state.api.recenterCamera(() => log("recenterCamera"));
    });
    document.getElementById("btnFocus").addEventListener("click", () => {
      if (!state.api) return;
      state.api.focusOnVisibleGeometries(() => log("focusOnVisibleGeometries"));
    });
    document.getElementById("btnSpin").addEventListener("click", (event) => {
      if (!state.api) return;
      state.spinning = !state.spinning;
      event.currentTarget.classList.toggle("is-active", state.spinning);
      // Autospin is init-only on many versions; emulate a stable orbit around the look-at target.
      state.api.getCameraLookAt((err, camera) => {
        if (err) return;
        if (!state.spinning) return;
        const tick = () => {
          if (!state.spinning || !state.api) return;
          state.api.getCameraLookAt((e2, cam) => {
            if (e2 || !cam) return;
            const target = cam.target;
            const relX = cam.position[0] - target[0];
            const relY = cam.position[1] - target[1];
            const relZ = cam.position[2] - target[2];
            const angle = 0.03;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const nextX = target[0] + (relX * cos - relY * sin);
            const nextY = target[1] + (relX * sin + relY * cos);
            const nextZ = target[2] + relZ;
            state.api.setCameraLookAt([nextX, nextY, nextZ], target, 0.2, () => {
              if (state.spinning) setTimeout(tick, 220);
            });
          });
        };
        tick();
      });
      log(state.spinning ? "Autospin an" : "Autospin aus");
    });

    el.fovRange.addEventListener("input", () => {
      if (!state.api) return;
      const fov = Number(el.fovRange.value);
      state.api.setFov(fov, () => {});
    });

    document.getElementById("btnWireframe").addEventListener("click", (event) => {
      if (!state.api) return;
      state.wireframe = !state.wireframe;
      event.currentTarget.classList.toggle("is-active", state.wireframe);
      state.api.setWireframe(state.wireframe, { color: "E4572EFF" }, (err) => {
        log(err ? "Wireframe nicht verfügbar" : `Wireframe ${state.wireframe}`);
      });
    });

    document.getElementById("shadingSelect").addEventListener("change", (event) => {
      if (!state.api) return;
      state.api.setShadingStyle(event.target.value, { type: "lit" }, (err) => {
        log(err ? "Shading fehlgeschlagen" : `Shading: ${event.target.value}`);
      });
    });

    document.getElementById("btnPost").addEventListener("click", (event) => {
      if (!state.api) return;
      state.postFx = !state.postFx;
      event.currentTarget.classList.toggle("is-active", state.postFx);
      state.api.setPostProcessing(
        {
          enable: state.postFx,
          sharpenEnable: state.postFx,
          ssaoEnable: state.postFx
        },
        () => log(`Post FX ${state.postFx ? "an" : "aus"}`)
      );
    });

    document.getElementById("btnBg").addEventListener("click", (event) => {
      if (!state.api) return;
      state.bgDark = !state.bgDark;
      event.currentTarget.classList.toggle("is-active", state.bgDark);
      const color = state.bgDark ? [0.05, 0.05, 0.04] : [0.85, 0.82, 0.76];
      state.api.setBackground({ color }, () => log("Background gesetzt"));
    });

    document.getElementById("btnShot").addEventListener("click", () => {
      if (!state.api) return;
      state.api.getScreenShot(1920, 1080, "image/png", (err, result) => {
        if (err || !result) {
          log("Screenshot fehlgeschlagen");
          return;
        }
        const a = document.createElement("a");
        a.href = result;
        a.download = `${state.uid || "sketchfab"}-shot.png`;
        a.click();
        log("Screenshot gespeichert");
      });
    });

    document.getElementById("btnClearAnnotations").addEventListener("click", () => {
      if (!state.api) return;
      state.api.removeAllAnnotations((err) => {
        if (err) log("Annotations löschen fehlgeschlagen");
        else {
          state.annotationCount = 0;
          refreshAnnotations(state.api);
          log("Annotations gelöscht");
        }
      });
    });
  }

  function boot() {
    bindUi();
    const params = new URLSearchParams(window.location.search);
    const fromQuery = extractUid(params.get("id"));
    const initial = favoriteByUid(fromQuery) || FAVORITES[0];
    const uid = fromQuery || initial.uid;
    const title = (favoriteByUid(uid) && favoriteByUid(uid).title) || initial.title;
    el.favoriteSelect.value = favoriteByUid(uid) ? uid : FAVORITES[0].uid;
    el.modelInput.value = favoriteByUid(uid) ? favoriteByUid(uid).url : uid;
    loadModel(uid, title);
  }

  boot();
})();
