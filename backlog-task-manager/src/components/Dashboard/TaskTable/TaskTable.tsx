import React from "react";
import { Container, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/hooks";
import { taskState } from "../taskSlice";
import { createRow } from "./taskTableSlice";
import 'bootstrap/dist/css/bootstrap.min.css'

export function TaskTable(){
    const curTable = useAppSelector((state) => state.taskTable.tasks);

    return (
        <Container>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Time Estimate</th>
                        <th className="text-center">Categories</th>
                        <th className="text-center">Expires</th>
                    </tr>
                </thead>
                <tbody>
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