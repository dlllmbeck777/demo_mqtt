import { Fragment, useEffect, useState } from "react";
import CompaniesDataService from "../../../../../services/companies.service";

function CompanyList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    retrieveCompanies();
  }, []);

  const retrieveCompanies = () => {
    CompaniesDataService.getAll()
      .then((response) => {
        setCompanies(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return <Fragment></Fragment>;
}

export default CompanyList;
