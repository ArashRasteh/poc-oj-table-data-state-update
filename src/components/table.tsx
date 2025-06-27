import { h, ComponentProps } from "preact";
import { useState, useRef, useMemo } from "preact/hooks";
import "ojs/ojbutton";
import "ojs/ojtable";
import "ojs/ojmenu";
import "ojs/ojinputtext";
import "ojs/ojtoolbar";
import { ojMenu } from "ojs/ojmenu";
import { ojTable } from "ojs/ojtable";
import { ojButton, ojButtonsetOne } from "ojs/ojbutton";
import { ojInputText } from "ojs/ojinputtext";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");
import { newRowAtTop } from "./app";
type Dept = {
  DepartmentId: number;
  DepartmentName: string;
  LocationId: number;
  ManagerId: number;
};

type Row = {
  rowKey: number | null;
};

// const Data = JSON.parse(deptData);
type TableProps = ComponentProps<"oj-table">;

const setColumnsDefault: TableProps["columnsDefault"] = {
  sortable: "disabled",
};
const setSelectionMode: TableProps["selectionMode"] = {
  row: "none",
  column: "none",
};
const setScrollPolicy: TableProps["scrollPolicyOptions"] = {
  fetchSize: 10,
  maxCount: 500,
};

const columnsDef: TableProps["columns"] = [
  {
    headerText: "Department Id",
    field: "DepartmentId",
    headerClassName: "oj-sm-only-hide",
    className: "oj-sm-only-hide",
    resizable: "enabled",
    sortable: "enabled",
    template: "deptIdTemplate",
  },
  {
    headerText: "Department Name",
    field: "DepartmentName",
    resizable: "enabled",
    template: "deptNameTemplate",
  },
  {
    headerText: "Location Id",
    field: "LocationId",
    headerClassName: "oj-sm-only-hide",
    className: "oj-sm-only-hide",
    resizable: "enabled",
    template: "locationIdTemplate",
  },
  { headerText: "Manager Id", field: "ManagerId", resizable: "enabled", template: "manageIdTemplate" },
  { headerText: "Action", resizable: "disabled", template: "actionTemplate" },
];

const menuListener = (event: ojMenu.ojMenuAction) => {
  console.log("Menu item " + event.detail.selectedValue + " was clicked");
};

type TableCompProps = {
  deptData: any;
  setDeptData: (data: Dept[]) => void;
}

const Table = ({
  deptData,
  setDeptData
}: TableCompProps) => {
  const [deptName, setDeptName] = useState<Dept["DepartmentName"]>();
  const [locationId, setLocationId] = useState<Dept["LocationId"]>();
  const [managerId, setManagerId] = useState<Dept["ManagerId"]>();
  const [editRow, setEditRow] = useState<Row>();
  const cancelEdit = useRef(false);

  

  const dataprovider: MutableArrayDataProvider<Dept["DepartmentId"], Dept> = useMemo(() => {
    return new MutableArrayDataProvider(deptData, {
      keyAttributes: "DepartmentId",
      implicitSort: [{ attribute: "DepartmentId", direction: "ascending" }],
    });
  }, [deptData]);

  const submitRow = (key: Dept["DepartmentId"]) => {
    let tempArray = [];
    for (let element of deptData) {
      if (element.DepartmentId === key) {
        console.log(element);
        element.DepartmentName = deptName;
        element.LocationId = locationId;
        element.ManagerId = managerId;
      }
      tempArray.push(element);
    }
    dataprovider.data = tempArray;
  };

  const beforeRowEditListener = (
    event: ojTable.ojBeforeRowEdit<Dept["DepartmentId"], Dept>
  ) => {
    const rowContext = event.detail.rowContext;
    setDeptName(rowContext.item.data.DepartmentName);
    setLocationId(rowContext.item.data.LocationId);
    setManagerId(rowContext.item.data.ManagerId);
  };
  const beforeRowEditEndListener = (
    event: ojTable.ojBeforeRowEditEnd<Dept["DepartmentId"], Dept>
  ) => {
    if (!cancelEdit.current) {
      const key = event.detail.rowContext.item.data.DepartmentId;
      submitRow(key);
    }
  };

  const updateDeptName = (event: ojInputText.valueChanged) => {
    if (event.detail.updatedFrom === "internal") {
      // newRowAtTop();
      // if (setDeptData) {
      //   setDeptData([...deptData]);
      // }
      setDeptName(event.detail.value);
    }
  };

  const updateLocationId = (event: ojInputText.valueChanged) => {
    if (event.detail.updatedFrom === "internal") {
      setLocationId(event.detail.value);
    }
  };

  const updateManagerId = (event: ojInputText.valueChanged) => {
    if (event.detail.updatedFrom === "internal") {
      setManagerId(event.detail.value);
    }
    setDeptData([...deptData]);
  };

  const editableTemplate = (
    cell: ojTable.CellTemplateContext<Dept["DepartmentId"], Dept>
  ) => {
    return (
      <>
        {cell.mode == "navigation" && cell.data}
        {cell.mode == "edit" && (
          <oj-input-text
            id="it1"
            value={deptName}
            class="editable"
            onvalueChanged={updateDeptName}></oj-input-text>
        )}
      </>
    );
  };

  const locationIdTemplate = (
    cell: ojTable.CellTemplateContext<Dept["DepartmentId"], Dept>
  ) => {
    if (cell.mode == "navigation") {
      return cell.data;
    }
    return <oj-input-text id="it1" value={locationId} class="editable" onvalueChanged={updateLocationId}></oj-input-text>;
  };

  const managerIdTemplate = (
    cell: ojTable.CellTemplateContext<Dept["DepartmentId"], Dept>
  ) => {
    if (cell.mode == "navigation") {
      return cell.data;
    }
    return <oj-input-text id="it1" value={managerId} class="editable" onvalueChanged={updateManagerId}></oj-input-text>;
  };

  const actionColumn = (
    cell: ojTable.CellTemplateContext<Dept["DepartmentId"], Dept>
  ) => {
    const handleUpdate = (event: ojButton.ojAction) => {
      setEditRow({ rowKey: cell.item.data.DepartmentId });
    };

    const handleEditOption = (event: ojButtonsetOne.valueChanged) => {
      if (event.detail.updatedFrom === "internal") {
        if (event.detail.value === "save") {
          cancelEdit.current = false;
          setEditRow({ rowKey: null });
        } else {
          cancelEdit.current = true;
          setEditRow({ rowKey: null });
        }
      }
    };

    return (
      <>
        {cell.mode == "navigation" && (
          <oj-button
            data-oj-clickthrough="disabled"
            display="icons"
            chroming="borderless"
            onojAction={handleUpdate}>
            <span slot="startIcon" class="oj-ux-ico-edit"></span>
            Edit
          </oj-button>
        )}

        {cell.mode == "edit" && (
          <oj-buttonset-one
            id="formatsetWidth1"
            aria-label="Choose only one format"
            display="icons"
            chroming="borderless"
            onvalueChanged={handleEditOption}
            class="oj-buttonset-width-auto">
            <oj-option value="save">
              <span slot="startIcon" class="oj-ux-ico-check"></span>
              Save
            </oj-option>
            <oj-option value="cancel">
              <span slot="startIcon" class="oj-ux-ico-multiply"></span>
              Cancel
            </oj-option>
          </oj-buttonset-one>
        )}
      </>
    );
  };
  return (
    <div>
      <oj-table
        id="table"
        aria-label="Departments Table"
        data={dataprovider}
        editMode="rowEdit"
        editRow={editRow}
        selectionMode={setSelectionMode}
        scrollPolicy="loadMoreOnScroll"
        scrollPolicyOptions={setScrollPolicy}
        columnsDefault={setColumnsDefault}
        columns={columnsDef}
        onojBeforeRowEdit={beforeRowEditListener}
        onojBeforeRowEditEnd={beforeRowEditEndListener}
        class="table-sizing">
        <template slot="actionTemplate" render={actionColumn}></template>
        <template slot="deptNameTemplate" render={editableTemplate}></template>
        <template slot="locationIdTemplate" render={locationIdTemplate}></template>
        <template slot="manageIdTemplate" render={managerIdTemplate}></template>
      </oj-table>
    </div>
  );
};
export default Table;