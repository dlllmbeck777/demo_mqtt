import {
  FILL_TAPS_OVERVIEW,
  CLEAN_TABS_OVERVIEW,
  SET_SELECT_TAB_ITEM_INDEX,
  SET_ISCHECKED,
  SET_UPDATE_ISCHECKED,
  SET_ITEM_DATA_OVERVIEW,
  SET_TAB_LOADER,
  SET_TAB,
  SET_COPY_HANDLE
} from "../types";
import Overview from "../../api/overview";
import ProfileService from "../../api/profile";
import axios from "axios";
import { uuidv4 } from "../../utils/uuidGenerator";
import { add_error } from "../error";

const dashboardResponseCache = new Map();
const dashboardResponsePromiseCache = new Map();
let selectedTabPersistTimer = null;

const getOverviewScope = (getState, linkId) => {
  const layer = String(getState()?.auth?.user?.active_layer || "Inkai").trim() || "Inkai";
  return {
    tabListKey: `${layer}:${linkId}:tablist`,
    selectedTabKey: `${layer}:${linkId}:selectedTab`,
    selectedTabTitleKey: `${layer}:${linkId}:selectedTabTitle`,
    legacyTabListKey: `${linkId}tablist`,
    legacySelectedTabKey: `${linkId}selectedTab`,
    legacySelectedTabTitleKey: `${linkId}selectedTabTitle`,
  };
};

const getDashboardCacheKey = (getState, linkId) => {
  const layer = String(getState()?.auth?.user?.active_layer || "Inkai").trim() || "Inkai";
  const culture = String(getState()?.lang?.cultur || "en").trim() || "en";
  return `${layer}:${culture}:${linkId}`;
};

export const invalidateOverviewDashboardCache = (getState, linkId) => {
  if (!linkId) {
    return;
  }

  const cacheKey = getDashboardCacheKey(getState, linkId);
  dashboardResponseCache.delete(cacheKey);
  dashboardResponsePromiseCache.delete(cacheKey);
};

const clampSelectedIndex = (value, titles) => {
  if (!Array.isArray(titles) || titles.length === 0) {
    return 0;
  }

  const parsed = Number.isInteger(value) ? value : parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(parsed, titles.length - 1);
};

const _setLinkedItem = () => (dispatch, getState) => {
  const selectedItem = getState().collapseMenu.selectedItem;
  let list = []
  function myFunc(myItems, index = 0) {
    myItems.map(e => {
      list.push([e.FROM_ITEM_ID, e.FROM_ITEM_NAME, index])
      if (e.CHILD) {
        myFunc(e.CHILD, index + 1)
      }
    })
  }
  myFunc([selectedItem])
  dispatch({
    type: SET_ITEM_DATA_OVERVIEW,
    payload: list
  })
}
let cancelToken;
export const loadTapsOverview = () => async (dispatch, getState) => {
  const selectedItem = getState().collapseMenu.selectedItem;
  const linkId = selectedItem?.FROM_ITEM_ID;
  if (!linkId) {
    dispatch(cleanTabs());
    return Promise.resolve([]);
  }
  try {
    if (cancelToken) {
      cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    const cacheKey = getDashboardCacheKey(getState, linkId);
    const body = JSON.stringify({ ITEM_ID: linkId })
    let responseData = dashboardResponseCache.get(cacheKey);

    if (!responseData) {
      let pendingRequest = dashboardResponsePromiseCache.get(cacheKey);
      if (!pendingRequest) {
        pendingRequest = Overview.getDashboards(body, cancelToken).then((res) => res.data);
        dashboardResponsePromiseCache.set(cacheKey, pendingRequest);
      }

      responseData = await pendingRequest;
      dashboardResponseCache.set(cacheKey, responseData);
      dashboardResponsePromiseCache.delete(cacheKey);
    }

    var titles;

    var widgets = responseData;
    var data = {}
    let setting = await ProfileService.getState({ "key": "overview_settings" })
    const {
      tabListKey,
      selectedTabKey,
      selectedTabTitleKey,
      legacyTabListKey,
      legacySelectedTabKey,
      legacySelectedTabTitleKey,
    } =
      getOverviewScope(getState, linkId);
    const savedTabList =
      setting?.data?.overview_settings?.[tabListKey] ??
      setting?.data?.overview_settings?.[legacyTabListKey];

    if (savedTabList) {
      titles = Object.keys(responseData);
      let tempList = []
      Promise.all(
        tempList = savedTabList.filter((item) => titles.includes(item))
      )
      let difference = []
      Promise.all(
        difference = titles.filter((item) => !tempList.includes(item))
      )
      Promise.all(difference.map(e => {
        tempList.push(e)
      }))
      titles = tempList

    } else {
      titles = Object.keys(responseData);
    }
    const savedSelectedTitle =
      setting?.data?.overview_settings?.[selectedTabTitleKey] ??
      setting?.data?.overview_settings?.[legacySelectedTabTitleKey];
    const savedSelectedIndex =
      setting?.data?.overview_settings?.[selectedTabKey] ??
      setting?.data?.overview_settings?.[legacySelectedTabKey] ??
      0;
    const selectedIndex =
      savedSelectedTitle && titles.includes(savedSelectedTitle)
        ? titles.indexOf(savedSelectedTitle)
        : clampSelectedIndex(savedSelectedIndex, titles);
    const selectedTitle = titles[selectedIndex] || titles[0] || null;

    await dispatch({
      type: FILL_TAPS_OVERVIEW,
      payload: { titles, widgets: widgets, data: data, selectedIndex },
    });
    dispatch(_setLinkedItem())
    await ProfileService.updateProfileSettings({
      overview_settings: {
        ...setting.data?.overview_settings,
        [tabListKey]: titles,
        [selectedTabKey]: selectedIndex,
        [selectedTabTitleKey]: selectedTitle,
      }
    })
    dispatch(setTapsLoaderFalse());
    return Promise.resolve(titles)
  } catch (err) {
    invalidateOverviewDashboardCache(getState, linkId);
    console.log(err);
    dispatch(cleanTabs());
    dispatch(setTapsLoaderFalse());
    return Promise.reject(err);
  }
};

export const selectTab = (payload) => async (dispatch, getState) => {
  const selectedItem = getState().collapseMenu.selectedItem?.FROM_ITEM_ID
  if (!selectedItem) {
    return
  }
  const { selectedTabKey, selectedTabTitleKey } = getOverviewScope(getState, selectedItem);
  const titles = getState().tapsOverview.titles || []
  const selectedIndex = clampSelectedIndex(payload, titles)
  const selectedTitle = titles[selectedIndex] || null
  dispatch({
    type: SET_SELECT_TAB_ITEM_INDEX,
    payload: selectedIndex,
  });

  if (selectedTabPersistTimer) {
    clearTimeout(selectedTabPersistTimer)
  }

  selectedTabPersistTimer = setTimeout(async () => {
    selectedTabPersistTimer = null
    try {
      let res = await ProfileService.getState({ "key": "overview_settings" })
      await ProfileService.updateProfileSettings({
        overview_settings: {
          ...res.data?.overview_settings,
          [selectedTabKey]: selectedIndex,
          [selectedTabTitleKey]: selectedTitle,
        }
      })
    } catch (err) {
      console.log(err);
    }
  }, 250)

  return Promise.resolve(selectedIndex)
};

export const cleanTabs = () => (dispatch) => {
  dispatch({
    type: CLEAN_TABS_OVERVIEW,
  });
};

export const deleteChart = (id) => async (dispatch, getState) => {
  const body = JSON.stringify({ WIDGET_ID: id });
  try {
    await dispatch(updateLayouts())
    let res = await Overview.removeWidget(body)
    invalidateOverviewDashboardCache(getState, getState().collapseMenu.selectedItem?.FROM_ITEM_ID)
    console.log(res);
    dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
    dispatch(loadTapsOverview());
    return true
  } catch (err) {
    dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    return false
  }
};

function _newTapNameChoser(keys) {
  let i = 0;
  while (true) {
    let newName = `Untitled ${i}`;
    if (!keys.some((e) => e === newName)) {
      return newName;
    }
    i++;
  }
}

export const addNewTabItem = () => async (dispatch, getState) => {
  const selectedItemID = getState().collapseMenu.selectedItem.FROM_ITEM_ID;
  const titles = getState().tapsOverview.titles
  const newTabName = _newTapNameChoser(titles);
  const culture = getState().lang.cultur
  const email = getState().auth.user.email
  const layer = getState().auth.user.active_layer
  const body = JSON.stringify({
    "NAME": newTabName,
    "CULTURE": culture,
    "LAYER_NAME": layer,
    "ITEM_ID": selectedItemID,
    "ROW_ID": uuidv4().replace(/-/g, ""),
    "WIDGETS": [],
    DASHBOARD_USER: [email]
  })
  try {
    let message = await Overview.updateDashboards(body)
    invalidateOverviewDashboardCache(getState, selectedItemID)

    let response = await dispatch(loadTapsOverview());
    dispatch(add_error(message.data?.status_message?.SHORT_LABEL, message.data?.status_code));
    let newIndex;
    Promise.all(
      response.map((e, i) => {
        if (e === newTabName) {
          newIndex = i;
        }
      })

    )
    dispatch(selectTab(newIndex))
  } catch (err) {
    console.log(err);
    dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    return Promise.reject(false)
  }
};

const _checkHeader = (oldHeader, newHeader, keys) => {
  if (oldHeader === newHeader) {
    return false;
  }
  if (keys.some((e) => e === newHeader)) {
    return false;
  }
  return true;
};

export const updateTabHeader =
  (oldHeader, newHeader) => async (dispatch, getState) => {
    const linkId = getState().collapseMenu.selectedItem.FROM_ITEM_ID;
    const { tabListKey } = getOverviewScope(getState, linkId);
    const titles = getState().tapsOverview.titles
    const widget = getState().tapsOverview.widgets[oldHeader]
    const culture = getState().lang.cultur
    const layer = getState().auth.user.active_layer
    if (_checkHeader(oldHeader, newHeader, (titles))) {
      const body = JSON.stringify({
        ROW_ID: widget.ROW_ID,
        NAME: newHeader,
        CULTURE: culture,
        LAYER_NAME: layer
      })
      try {
        let message = await Overview.updateDashboards(body)
        invalidateOverviewDashboardCache(getState, linkId)
        var index = titles.indexOf(oldHeader);
        if (index !== -1) {
          titles[index] = newHeader;
        }

        let setting = await ProfileService.getState({ "key": "overview_settings" })
        await ProfileService.updateProfileSettings({
          overview_settings: {
            ...setting.data?.overview_settings,
            [tabListKey]: titles
          }
        })
        const response = await dispatch(loadTapsOverview());
        dispatch(add_error(message.data?.status_message?.SHORT_LABEL, message.data?.status_code));
        let res = 0

        return Promise.resolve(res)

      } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        console.log(err);
        return Promise.reject(false)
      }
    };
    return Promise.reject(false)

  };

export const deleteTapHeader = (header) => async (dispatch, getState) => {
  const dashboard = getState().tapsOverview.widgets[header];
  const titles = getState().tapsOverview.titles;
  const selectedIndex = getState().tapsOverview.selectedIndex;
  const selectedItem = getState().collapseMenu.selectedItem.FROM_ITEM_ID
  const { selectedTabKey } = getOverviewScope(getState, selectedItem);
  try {
    dispatch(updateLayouts())
    const body = JSON.stringify({ ROW_ID: dashboard.ROW_ID })
    let res = await Overview.removeDashboards(body)
    invalidateOverviewDashboardCache(getState, selectedItem)
    console.log(res);
    dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
    let newIndex = 0;
    let deletedIndex = 0;
    Promise.all(
      titles.map((e, i) => {
        if (e === header) {
          deletedIndex = i
        }
      }
      )
    )
    if (deletedIndex < selectedIndex) {
      newIndex = selectedIndex - 1
    } else {
      newIndex = selectedIndex
    }
    try {
      let res = await ProfileService.getState({ "key": "overview_settings" })
      await ProfileService.updateProfileSettings({
        overview_settings: {
          ...res.data?.overview_settings,
          [selectedTabKey]: newIndex
        }
      })
    } catch (err) {
      console.log(err);
    }
    await dispatch(loadTapsOverview());

  } catch (err) {
    dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    console.log(err);
  }
};

export const updateLayouts = () => async (dispatch, getState) => {
  const title = getState().tapsOverview.titles
  const selected = getState().tapsOverview.selectedIndex
  const layouts = getState().tapsOverview?.widgets?.[title[selected]]?.layouts;
  const body = JSON.stringify(layouts)
  try {
    let res = await Overview.layoutUpdate(body)
  } catch (err) { console.log(err); }
};

export const updateChecked = (key, val) => (dispatch) => {
  dispatch({
    type: SET_UPDATE_ISCHECKED,
    payload: { key: key, val: val },
  });
}

export const setCheckeds = (val) => (dispatch) => {
  let temp = {}
  val.map(e => {
    temp[e.TAG_ID] = false
  })
  dispatch({
    type: SET_ISCHECKED,
    payload: temp
  })
}

export const setCheckedsAsset = (val) => (dispatch) => {
  let temp = {}
  val.map(e => {
    temp[e[0]] = false
  })
  dispatch({
    type: SET_ISCHECKED,
    payload: temp
  })
}

export const setTapsLoaderTrue = () => dispatch => {
  dispatch({
    type: SET_TAB_LOADER,
    payload: true
  })
}

export const setTapsLoaderFalse = () => dispatch => {
  dispatch({
    type: SET_TAB_LOADER,
    payload: false
  })
}

export const dublicateDashboard = (id) => async (dispatch, getState) => {
  const dashboard = getState().tapsOverview.widgets[id]
  try {
    let res = await Overview.dublicateDashboard({ ROW_ID: dashboard.ROW_ID })
    invalidateOverviewDashboardCache(getState, getState().collapseMenu.selectedItem?.FROM_ITEM_ID)
    dispatch(loadTapsOverview())
    dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code))
  } catch (err) {
    dispatch(
      add_error(
        err?.response?.data?.status_message?.SHORT_LABEL,
        err?.response?.data?.status_code
      )
    ); console.log(err);
  }

}

export const chageTabsSort = (prevIndex, nextIndex) => async (dispatch, getState) => {
  const titles = getState().tapsOverview.titles
  const selectedIndex = getState().tapsOverview.selectedIndex
  const selectedItem = getState().collapseMenu.selectedItem.FROM_ITEM_ID
  const { tabListKey } = getOverviewScope(getState, selectedItem);
  const newTabs = Array.from(titles);
  const draggedTab = newTabs.splice(prevIndex, 1)[0];
  newTabs.splice(nextIndex, 0, draggedTab);
  dispatch({
    type: SET_TAB,
    payload: newTabs
  })
  if (prevIndex === selectedIndex) {
    await dispatch(selectTab(nextIndex))
  }
  else if (selectedIndex <= nextIndex && selectedIndex >= prevIndex) {
    await dispatch(selectTab(selectedIndex - 1))
  }
  else if (selectedIndex <= prevIndex && selectedIndex >= nextIndex) {
    await dispatch(selectTab(selectedIndex + 1))
  }
  else if (nextIndex === selectedIndex) {
    await dispatch(selectTab(prevIndex))
  }
  else {
    await dispatch(selectTab(selectedIndex))
  }
  try {
    let res = await ProfileService.getState({ "key": "overview_settings" })
    let aa = await ProfileService.updateProfileSettings({
      overview_settings: {
        ...res.data?.overview_settings,
        [tabListKey]: newTabs
      }
    })
    console.log(aa);
  } catch (err) {
    console.log(err);
  }

}

export const handleCopyOneTab = (id) => (dispatch, getState) => {
  const dashboard = getState().tapsOverview.widgets[id]
  dispatch({
    type: SET_COPY_HANDLE,
    payload: { [id]: dashboard }
  })
}

export const handlePaste = () => async (dispatch, getState) => {
  const TO_ITEM_ID = getState().collapseMenu?.selectedItem?.FROM_ITEM_ID
  const copy = getState().tapsOverview.copy
  try {
    let res = await Overview.pasteOneDash({ DATA: copy, TO_ITEM_ID })
    invalidateOverviewDashboardCache(getState, TO_ITEM_ID)
    dispatch(loadTapsOverview())
  } catch (err) {
    console.log(err);
  }

}

export const handleCopyAll = () => async (dispatch, getState) => {
  const widgets = getState().tapsOverview.widgets
  dispatch({
    type: SET_COPY_HANDLE,
    payload: widgets
  })

}

export const deleteAllTabs = () => async (dispatch, getState) => {
  const FROM_ITEM_ID = getState().collapseMenu?.selectedItem?.FROM_ITEM_ID
  try {
    let res = await Overview.deleteAllTab({ FROM_ITEM_ID })
    invalidateOverviewDashboardCache(getState, FROM_ITEM_ID)
    dispatch(loadTapsOverview())
  } catch (err) {
    console.log(err);
  }
}
