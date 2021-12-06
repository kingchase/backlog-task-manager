import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/hooks";
import { taskState } from "../taskSlice";
import { createRow } from "./taskTableSlice";
import {useForm} from 'react-hook-form'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../../App.css'
import { selectTableInput, updateByIndex } from "./tableInputSlice";
import { bindActionCreators } from "redux";

let url:string;
        if (process.env.BACKEND_URL) {
            url = process.env.BACKEND_URL;
        } else {
            url = "http://localhost:9000"
        }

function cat_separate (cat: string) {
    let sofar:string = "";
    let ret:string[] = [];
    for (var i = 0; i < cat.length; i++) {
        if (cat[i] == ';') {
            ret.push(sofar);
            sofar = "";
        } else {
            sofar = sofar + cat[i];
        }
    }
    ret.push(sofar);
    console.log(cat)
    console.log(ret)
    return ret;
}

let inputs:string[] = ["","","",""];

export function TaskTable(){
    const curTable = useAppSelector((state) => state.taskTable.tasks);
    const tableInputs = selectTableInput;
    const dispatch = useDispatch()
    const inputChange = (id: string, index: number) => {
        let val = document.getElementById(id)!.nodeValue; let str; if (val) {str = val;} else {str = ""} inputs[index] = str;
    }
    return (
        <Container>
            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick= {async () => {
                    const res = await fetch(url + "/tasks/add-task", {
                        method: "POST",
                        body: JSON.stringify({
                            task_name: inputs[0],
                            time_estimate: inputs[1],
                            categories: cat_separate(inputs[2]),
                            expiration_date: inputs[3]
                        })
                    })
                }}>
                    Submit New Task
                 </Button>
            </div>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Time Estimate</th>
                        <th className="text-center">Categories</th>
                        <th className="text-center">Expires</th>
                    </tr>
                </thead>
                {/*TODO: onChange not actually setting field. Figure that out. Cookie not properly setting for user id*/}
                <tbody>
                    <tr>
                        <td><input id="i_task_name" name="task_name" type="text" onChange= {
                            (state) => {inputChange("i_task_name", 0)}
                        }/></td>
                        <td><input id="i_time_estimate" name="time_estimate" type="text" onChange= {
                            (state) => {inputChange("i_time_estimate", 1)}
                        }/></td>
                        <td><input id="i_categories" name="categories" type="text" onChange= {
                            (state) => {inputChange("i_categories", 2)}
                        }/></td>
                        <td><input id="i_expiration" name="expiration" type="text" onChange= {
                            (state) => {inputChange("i_expiration", 3); }
                        }/></td>
                    </tr>
                    {curTable.map((item:taskState, idx: number) => (
                        <tr id="addr0" key={item.task_id}>
                            <td className="text-center">{curTable[idx].task_name}</td>
                            <td className="text-center">{curTable[idx].time_estimate}</td>
                            <td className="text-center">{curTable[idx].categories}</td>
                            <td className="text-center">{curTable[idx].expiration_date.getUTCDate()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}