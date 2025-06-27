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

export let dataWasChanged: () => void = () => {};

export const App = registerCustomElement(
  "app-root",
  ({ appName = "App Name", userLogin = "john.hancock@oracle.com" }: Props) => {
    useEffect(() => {
      Context.getPageContext().getBusyContext().applicationBootstrapComplete();
    }, []);

    const [deptData, setDeptData] = useState<any[]>(JSON.parse(_deptData));
    const [totalManagerId, setTotalManagerId] = useState(0);
    const [count, setCount] = useState(0);

    // const deptData = JSON.parse(_deptData);

    dataWasChanged = () => {
      // const newRow =   {
      //   "DepartmentId": Math.floor(Math.random() * 1000000),
      //   "DepartmentName": "Innovation Lab 42",
      //   "LocationId": 250,
      //   "ManagerId": 3002,
      //   "StartDate": "2023-06-15",
      //   "EmployeeCount": 127,
      //   "Type": "IT",
      //   "Currency": "USD",
      //   "Primary": [],
      //   "Rating": 4,
      //   "TargetComplete": 92
      // }
      setDeptData([...deptData]);
      // deptData.unshift(newRow);
      // console.log(deptData);
    }

    useEffect(() => {
      if (deptData) {
        recalculateTotalManagerId();
      }
    }, [deptData]);

    const recalculateTotalManagerId = () => {
      const total = deptData.reduce((acc: number, curr: any) => acc + Number(curr.ManagerId), 0);
      console.log("new total", total);
      setTotalManagerId(total);
    }

    return (
      <div id="appContainer" class="oj-web-applayout-page">
        {/* <button onClick={newRowAtTop}>Add a new row to the top</button> */}
        {deptData && <Table deptData={deptData} setDeptData={setDeptData} />} 
        <p>Total Manager Id: {totalManagerId}</p>
        <button onClick={() => {
          const newDeptData = deptData.map((dept) => ({
            ...dept,
            ManagerId: Number(dept.ManagerId) + 1
          }));
          setDeptData(newDeptData);
        }}>Add One to all Manager Ids</button>
      </div>
    );
  }
);