/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import Context = require("ojs/ojcontext");
import "ojs/ojtable";
import Table from "./table";
import * as _deptData from "text!./data/departmentData.json";

type Props = Readonly<{
  appName?: string;
  userLogin?: string;
}>;

export let newRowAtTop: () => void = () => {};

export const App = registerCustomElement(
  "app-root",
  ({ appName = "App Name", userLogin = "john.hancock@oracle.com" }: Props) => {
    useEffect(() => {
      Context.getPageContext().getBusyContext().applicationBootstrapComplete();
    }, []);

    const [deptData, setDeptData] = useState(JSON.parse(_deptData));

    // const deptData = JSON.parse(_deptData);

    newRowAtTop = () => {
      const newRow =   {
        "DepartmentId": Math.floor(Math.random() * 1000000),
        "DepartmentName": "Innovation Lab 42",
        "LocationId": 250,
        "ManagerId": 3002,
        "StartDate": "2023-06-15",
        "EmployeeCount": 127,
        "Type": "IT",
        "Currency": "USD",
        "Primary": [],
        "Rating": 4,
        "TargetComplete": 92
      }
      setDeptData([newRow, ...deptData]);
      // deptData.unshift(newRow);
      // console.log(deptData);
    }

    return (
      <div id="appContainer" class="oj-web-applayout-page">
        {/* <button onClick={newRowAtTop}>Add a new row to the top</button> */}
        {deptData && <Table deptData={deptData} />} 
      </div>
    );
  }
);