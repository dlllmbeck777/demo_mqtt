import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Select, MyTextField, MyNumberTextField } from "../../../../components";
import { Box } from "@mui/material";
import {
  setBodyConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../services/actions/confirmation/historyConfirmation";
import {
  updateData,
  loadDatabases,
  loadKubernetes,
  saveProject,
  cleanProjectData,
  loadProject,
} from "../../../../services/actions/project/project";
import { useIsMount } from "../../../../hooks/useIsMount";
import { isUpdated } from "../../../../services/utils/permissions";
const Postgre = ({ selectedType, selectedIndex }) => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const values = useSelector((state) => state.project?.databases);
  const defaultValue = useSelector((state) => state.project?.data?.DATA_SOURCE);
  React.useEffect(() => {
    if (!isMount && defaultValue) dispatch(loadKubernetes());
  }, [defaultValue]);
  return (
    <Select
      disabled={selectedIndex !== -2 && !dispatch(isUpdated(selectedType))}
      values={values}
      valuesPath="CODE"
      dataTextPath="CODE_TEXT"
      handleChangeFunc={(value) => {
        dispatch(updateData("DATA_SOURCE", value));
      }}
      defaultValue={defaultValue}
    />
  );
};

const Kubernetes = ({ selectedType, selectedIndex }) => {
  const dispatch = useDispatch();
  const values = useSelector((state) => state.project?.kubernetes);
  const defaultValue = useSelector((state) => state.project?.data?.DB_SETTINGS);
  return (
    <Select
      disabled={selectedIndex !== -2 && !dispatch(isUpdated(selectedType))}
      values={values}
      dataTextPath="NAME"
      valuesPath="HOST"
      handleChangeFunc={(value) => {
        dispatch(updateData("DB_SETTINGS", value));
      }}
      defaultValue={defaultValue}
    />
  );
};

const ProjectName = ({ selectedType, selectedIndex }) => {
  const dispatch = useDispatch();
  const defaultValue = useSelector((state) => state.project?.data?.LAYER_NAME);
  return (
    <MyTextField
      disabled={selectedIndex !== -2 && !dispatch(isUpdated(selectedType))}
      defaultValue={defaultValue}
      handleChangeFunc={(value) => {
        dispatch(updateData("LAYER_NAME", value));
      }}
    />
  );
};

const LayerLevel = ({ selectedType, selectedIndex }) => {
  const dispatch = useDispatch();
  const defaultValue = useSelector((state) => state.project?.data?.LAYER_LEVEL);
  return (
    <MyNumberTextField
      disabled={selectedIndex !== -2 && !dispatch(isUpdated(selectedType))}
      defaultValue={defaultValue}
      handleChangeFunc={(value) => {
        dispatch(updateData("LAYER_LEVEL", value));
      }}
    />
  );
};
const Body = () => {
  const dispatch = useDispatch();
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector((state) => state.treeview.selectedItem.LAYER_NAME);
  const selectedType = useSelector((state) => state.drawerMenu.selectedItem.ID);

  React.useEffect(() => {
    dispatch(loadDatabases());
    dispatch(setSaveFunctonConfirmation(saveProject));
    dispatch(setTitleConfirmation("Are you sure you want to save this ? "));
    dispatch(setBodyConfirmation(`${name ? name : "new"}`));
    if (selectedIndex !== -3) dispatch(cleanProjectData());
    if (selectedIndex !== -2 && selectedIndex !== -3) {
      dispatch(loadProject());
    }
  }, [selectedIndex, name]);

  return (
    <Box className="project-container__body">
      <Box className="project-container__body__input-container">
        <Box className="project-container__body__input-container__label">
          Data Source
        </Box>
        <Box className="project-container__body__input-container__input">
          <Postgre selectedType={selectedType} selectedIndex={selectedIndex} />
        </Box>
      </Box>
      <Box className="project-container__body__input-container">
        <Box className="project-container__body__input-container__label">
          Data Source Status
        </Box>
        <Box className="project-container__body__input-container__input">
          <Kubernetes
            selectedType={selectedType}
            selectedIndex={selectedIndex}
          />
        </Box>
      </Box>
      <Box className="project-container__body__input-container">
        <Box className="project-container__body__input-container__label">
          Project Name
        </Box>
        <Box className="project-container__body__input-container__input">
          <ProjectName
            selectedType={selectedType}
            selectedIndex={selectedIndex}
          />
        </Box>
      </Box>
      <Box className="project-container__body__input-container">
        <Box className="project-container__body__input-container__label">
          Layer Level
        </Box>
        <Box className="project-container__body__input-container__input">
          <LayerLevel
            selectedType={selectedType}
            selectedIndex={selectedIndex}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Body;
