import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Collapse,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import CodeListSetting from "./CodeListSetting";
import {
  getWithLISTTYPE,
  clearlistTypeSchema,
  setIsOpen,
} from "../services/actions/codelist";

const TableItems = (props) => {
  const dispatch = useDispatch();
  const temp = useSelector((state) => state.codelist);

  const onClickHandler = () => {
    dispatch(clearlistTypeSchema());
    if (!(props.temp.LISTTYPE === temp.isOpen)) {
      dispatch(setIsOpen(props.temp.LISTTYPE));
      dispatch(getWithLISTTYPE(props.temp.LISTTYPE));
    }
  };

  return (
    <>
      <React.Fragment>
        <TableRow>
          <TableCell
            sx={{ cursor: "pointer" }}
            onClick={() => {
              onClickHandler();
            }}
          >
            +
          </TableCell>
          <TableCell>{props.temp.LISTTYPE}</TableCell>
          <TableCell>{props.temp.CULTURE}</TableCell>
          <TableCell>{props.temp.CODE}</TableCell>
          <TableCell>{props.temp.CODETEXT}</TableCell>
          <TableCell>{props.temp.PARENT}</TableCell>
          <TableCell>{props.temp.LEGACYMODE}</TableCell>
          <TableCell>{props.temp.VAL1}</TableCell>
          <TableCell>{props.temp.VAL2}</TableCell>
          <TableCell>{props.temp.VAL3}</TableCell>
          <TableCell>{props.temp.VAL4}</TableCell>
          <TableCell>{props.temp.VAL5}</TableCell>
          <TableCell>{props.temp.VAL6}</TableCell>
          <TableCell>{props.temp.VAL7}</TableCell>
          <TableCell>{props.temp.VAL8}</TableCell>
          <TableCell>{props.temp.VAL9}</TableCell>
          <TableCell>{props.temp.VAL10}</TableCell>
          <TableCell>{props.temp.DATE1}</TableCell>
          <TableCell>{props.temp.DATE2}</TableCell>
          <TableCell>{props.temp.DATE3}</TableCell>
          <TableCell>{props.temp.DATE4}</TableCell>
          <TableCell>{props.temp.DATE5}</TableCell>
          <TableCell>{props.temp.CHAR1}</TableCell>
          <TableCell>{props.temp.CHAR2}</TableCell>
          <TableCell>{props.temp.CHAR3}</TableCell>
          <TableCell>{props.temp.CHAR4}</TableCell>
          <TableCell>{props.temp.CHAR5}</TableCell>
          <TableCell>{props.temp.LAYERNAME}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={28}>
            <Collapse
              in={temp.isOpen === props.temp.LISTTYPE}
              timeout="auto"
              unmountOnExit
            >
              {temp.listTypeSchema ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="center">Listtype</TableCell>
                      <TableCell align="center">Culture</TableCell>
                      <TableCell align="center">Code</TableCell>
                      <TableCell align="center">Codetext</TableCell>
                      <TableCell align="center">Parent</TableCell>
                      <TableCell align="center">Legacycode</TableCell>
                      <TableCell align="center">Val1</TableCell>
                      <TableCell align="center">Val2</TableCell>
                      <TableCell align="center">Val3</TableCell>
                      <TableCell align="center">Val4</TableCell>
                      <TableCell align="center">Val5</TableCell>
                      <TableCell align="center">Val6</TableCell>
                      <TableCell align="center">Val7</TableCell>
                      <TableCell align="center">Val8</TableCell>
                      <TableCell align="center">Val9</TableCell>
                      <TableCell align="center">Val10</TableCell>
                      <TableCell align="center">Date1</TableCell>
                      <TableCell align="center">Date2</TableCell>
                      <TableCell align="center">Date3</TableCell>
                      <TableCell align="center">Date4</TableCell>
                      <TableCell align="center">Date5</TableCell>
                      <TableCell align="center">Char1</TableCell>
                      <TableCell align="center">Char2</TableCell>
                      <TableCell align="center">Char3</TableCell>
                      <TableCell align="center">Char4</TableCell>
                      <TableCell align="center">Char5</TableCell>
                      <TableCell align="center">LayerName</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(temp.listTypeSchema).map((key, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <CodeListSetting id={temp.listTypeSchema[key].id} />
                        </TableCell>
                        <TableCell>
                          {temp.listTypeSchema[key].LISTTYPE}
                        </TableCell>
                        <TableCell>
                          {temp.listTypeSchema[key].CULTURE}
                        </TableCell>
                        <TableCell>{temp.listTypeSchema[key].CODE}</TableCell>
                        <TableCell>
                          {temp.listTypeSchema[key].CODETEXT}
                        </TableCell>
                        <TableCell>{temp.listTypeSchema[key].PARENT}</TableCell>
                        <TableCell>
                          {temp.listTypeSchema[key].LEGACYMODE}
                        </TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL1}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL2}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL3}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL4}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL5}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL6}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL7}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL8}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL9}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].VAL10}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].DATE1}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].DATE2}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].DATE3}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].DATE4}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].DATE5}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].CHAR1}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].CHAR2}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].CHAR3}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].CHAR4}</TableCell>
                        <TableCell>{temp.listTypeSchema[key].CHAR5}</TableCell>
                        <TableCell>
                          {temp.listTypeSchema[key].LAYERNAME}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <>
                  {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((a, i) => (
                    <Box
                      sx={{
                        width: "8%",
                        display: "inline-block",
                        margin: "1%",
                      }}
                      key={i}
                    >
                      <Skeleton />
                      <Skeleton animation="wave" />
                      <Skeleton animation={false} />
                    </Box>
                  ))}
                </>
              )}
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    </>
  );
};

export default TableItems;
