import React from "react";
import { useSelector } from "react-redux";

import LinkItem from "./linkItem";
const ItemLinks = ({ itemType, ...rest }) => {
  const res = useSelector((state) => state.itemLinkEditor[itemType]);
  return res.map((e, i) => <LinkItem e={e} i={i} {...rest} />);
};

export default ItemLinks;
