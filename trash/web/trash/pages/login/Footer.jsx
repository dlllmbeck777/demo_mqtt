import React from "react";

import { Box, Grid, Typography, Link } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";

import LangSelector from "../../components/LangSelector";
import langPicker from "./LangPicker";
import styles from "../../assets/Styles/pages/login/footer";
const Footer = () => {
  const text = langPicker();
  return (
    <Box sx={styles().box}>
      <Grid container alignItems="center" sx={styles().flexBox}>
        <Grid item>
          <Grid>
            {[
              text.footer.nav1,
              text.footer.nav2,
              text.footer.nav3,
              text.footer.nav4,
            ].map((e, i) => (
              <Link href="#" key={i} sx={styles().link}>
                <Typography sx={styles().navItem}>{e}</Typography>
              </Link>
            ))}
          </Grid>
        </Grid>
        <Grid item sx={{ ml: 2 }}>
          <Grid container alignItems="center" sx={styles().text}>
            <Grid item>
              <Grid container alignItems="center">
                <CopyrightIcon sx={styles().textItem} />
                <Typography sx={styles().textItem}>
                  {text.footer.text}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sx={styles().langSelector}>
              <LangSelector />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
