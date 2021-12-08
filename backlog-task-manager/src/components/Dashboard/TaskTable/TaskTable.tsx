import React from "react";
import { Container, Table, Button, ButtonGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/hooks";
import { taskState } from "../taskSlice";
import { createRow, removeRow, sortTableAZ, sortTableExpiringSoonest, sortTableGreaterTime, sortTableLessTime } from "./taskTableSlice";
import {useForm} from 'react-hook-form'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../../App.css'
import { selectTableInput, updateByIndex } from "./tableInputSlice";
import { bindActionCreators } from "redux";
import { ESRCH } from "constants";

let url:string;
        if (process.env.BACKEND_URL) {
            url = process.env.BACKEND_URL;
        } else {
            url = "http://localhost:9000"
        }

// function cat_separate (cat: string) {
//     let sofar:string = "";
//     let ret:string[] = [];
//     for (var i = 0; i < cat.length; i++) {
//         if (cat[i] === ';') {
//             ret.push(sofar);
//             sofar = "";
//         } else {
//             sofar = sofar + cat[i];
//         }
//     }
//     ret.push(sofar);
//     console.log(cat)
//     console.log(ret)
//     return ret;
// }

export function TaskTable(){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json'); 

    const curTable = useAppSelector((state) => state.taskTable.tasks);
    let inputs:string[] = ["","","",""];
    const dispatch = useDispatch()
    const inputChange = (event: any, index: number) => {
        const val = event.target.value;
        const str = val||"";
        inputs[index] = str;
    }
    return (
        <Container>
            <div>
                <ButtonGroup>
                    <Button onClick={(state) => {dispatch(sortTableAZ())}}>
                        Sort A-Z
                    </Button>
                    <Button onClick={(state) => {dispatch(sortTableGreaterTime())}}>
                        Time Estimate ↑
                    </Button>
                    <Button onClick={(state) => {dispatch(sortTableLessTime())}}>
                        Time Estimate ↓
                    </Button>
                    <Button onClick={(state) => {dispatch(sortTableExpiringSoonest())}}>
                        Expiring Soon
                    </Button>
                </ButtonGroup>
            </div>
            <Table bordered hover responsive variant="dark">
                <thead>
                    <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Time Estimate</th>
                        <th className="text-center">Category</th>
                        <th className="text-center">Expires</th>
                    </tr>
                </thead>
                {/*TODO: onChange not actually setting field. Figure that out. Cookie not properly setting for user id*/}
                <tbody>
                    <tr>
                        <td><input id="i_task_name" name="task_name" type="text" onChange= {
                            e => {inputChange(e, 0)}
                        }/></td>
                        <td><input id="i_time_estimate" name="time_estimate" type="text" onChange= {
                            e => {inputChange(e, 1)}
                        }/></td>
                        <td><input id="e" name="categories" type="text" onChange= {
                            e => {inputChange(e, 2)}
                        }/></td>
                        <td><input id="i_expiration" name="expiration" type="text" onChange= {
                            e => {inputChange(e, 3); }
                        }/></td>
                        <Button onClick= {async () => {
                     
                     await fetch(url + "/tasks/add-task", {
                         method: "POST",
                         headers: headers,
                         redirect: 'follow',
                         credentials: 'include',
                         body: JSON.stringify({
                             task_name: inputs[0],
                             time_estimate: inputs[1],
                             category: inputs[2],
                             expiration_date: inputs[3]
                         })
                     }).then(async(res) => {
                         const id = await res.text();
                         const new_task:taskState = {
                             task_id: parseInt(id),
                             task_name: inputs[0],
                             time_estimate: parseInt(inputs[1]),
                             category: inputs[2],
                             expiration_date: new Date(inputs[3]), 
                         }
                         dispatch(createRow(new_task));
                     })
                 }}>
                     Submit New Task
                  </Button>
                    </tr>
                    {curTable.map((item:taskState, idx: number) => (
                        <tr id="addr0" key={item.task_id}>
                            
                            <td className="text-center">{curTable[idx].task_name}</td>
                            <td className="text-center">{curTable[idx].time_estimate + ' mins'}</td>
                            <td className="text-center">{curTable[idx].category}</td>
                            <td className="text-center">{curTable[idx].expiration_date.toString()}</td>
                            <a className='trash-icon' onClick={async (state) => {
                                await fetch(url + "/tasks/remove-task", {
                                    method: "POST",
                                    headers: headers,
                                    redirect: 'follow',
                                    credentials: 'include',
                                    body: JSON.stringify({
                                        task_id: curTable[idx].task_id
                                    })
                                }).then(() => {
                                    dispatch(removeRow(idx))
                                }).catch(() => {
                                    console.log("Could not Delete.");
                                })
                            }}>{'🗑'}</a>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}