/*
 * This file is part of the IoT Management Service
 * Copyright 2019 Canonical Ltd.
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License version 3, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
 * SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


import React, {Component} from 'react';
import AlertBox from './AlertBox';
import DialogBox from "./DialogBox";
import api from "../models/api";
import {T, formatError} from './Utils';
import moment from 'moment-timezone';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

var local_tz = moment.tz.guess();

class Devices extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message: null,
            confirmDelete: null,
            device: {orgid: this.props.account.orgid}
        };
    }

    getAge(m) {
        var start = moment(m);
        var end = moment()
        var dur = moment.duration(end.diff(start));
        var d = dur.asMinutes()
        if (d < 2) {
            return <i className="fa fa-clock led-green" title={start.format('llll')} />
        } else if (d < 5) {
            return <i className="fa fa-clock led-orange" title={start.format('llll')} />
        } else {
            return <i className="fa fa-clock led-red" title={start.format('llll')} />
        }
    }

    renderTable(items) {
        if (items != null && items.length > 0) {
            return (
            // <div>
            //     <table>
            //     <thead>
            //         <tr>
            //         <th className="small" /><th>{T('brand')}</th><th>{T('model')}</th><th>{T('serial')}</th><th>{T('reg-date')}</th><th>{T('last-update')}</th>
            //         </tr>
            //     </thead>
            //     <tbody>
            //         {this.renderRows(items)}
            //     </tbody>
            //     </table>
            // </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{T('brand')}</TableCell>
                                <TableCell align="right">{T('model')}</TableCell>
                                <TableCell align="right">{T('serial')}</TableCell>
                                <TableCell align="right">{T('reg-date')}</TableCell>
                                <TableCell align="right">{T('last-update')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderRows(items)}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        } else {
            return (
            <p>{T('no-devices-connected')}</p>
            );
        }
    }

    handleDelete = (e) => {
        e.preventDefault();
        this.setState({confirmDelete: e.target.getAttribute('data-key')});
    }

    handleDeleteDevice = (e) => {
        e.preventDefault();
        var devices = this.props.devices.filter((device) => {
            return device.deviceId === this.state.confirmDelete;
        });

        if (devices.length === 0) {
            console.log("devices.length == 0")
            return;
        }

        api.deviceDelete(this.props.account.orgid, devices[0].deviceId).then(response => {
            window.location = '/devices';
        })
            .catch((e) => {
                this.setState({error: formatError(e.response.data)});
            })
    }

    handleDeleteDeviceCancel = (e) => {
        e.preventDefault();
        this.setState({confirmDelete: null});
    }

    renderDelete(device) {
        if (device.deviceId !== this.state.confirmDelete) {
            return (
                <button onClick={this.handleDelete} data-key={device.deviceId} className="p-button--neutral small" title={T('delete-device')}>
                    <i className="fa fa-trash" data-key={device.deviceId} /></button>
            );
        } else {
            return (
                <DialogBox message={T('confirm-device-delete')} handleYesClick={this.handleDeleteDevice} handleCancelClick={this.handleDeleteDeviceCancel} />
            );
        }
    }

    handleLogUrlChange = (e) => {
        e.preventDefault();
        this.setState({deviceLogUrl: e.target.value});
    }

    handleLogLimitChange = (e) => {
        e.preventDefault();
        this.setState({deviceLogLimit: e.target.value});
    }

    renderDeviceLogtDialog(device) {
        if (device.deviceId !== this.state.deviceLogDialog) {
            return
        }

        return (
            <tr>
                <td colSpan="6">
                    <form>
                        <fieldset>
                            <label htmlFor={this.state.deviceLogDialog}>
                                Log upload url:
                                <input type="text" rows="12" value={this.state.deviceLogUrl} data-key={this.state.deviceLogDialog} onChange={this.handleLogUrlChange}/>
                            </label>
                            <label htmlFor={this.state.deviceLogDialog}>
                                Limit:
                                <input type="text" value={this.state.deviceLogLimit} data-key={this.state.deviceLogDialog} onChange={this.handleLogLimitChange}/>
                            </label>
                        </fieldset>
                        <button className="p-button--brand" onClick={this.handleDeviceLogsSend} data-key={device.deviceId}>{T('Send')}</button>
                        <button className="p-button--brand" onClick={this.handleDeviceLogsCancel} data-key={device.deviceId}>{T('cancel')}</button>
                    </form>
                </td>
            </tr>
        )
    }

    handleDeviceLogsSend = (e) => {
        e.preventDefault();
        var device = e.target.getAttribute('data-key');
        var settings = JSON.stringify({
            url: this.state.deviceLogUrl,
            limit: parseInt(this.state.deviceLogLimit)})

        api.deviceLogsNew(this.props.account.orgid, device, settings).then(response => {
            this.handleMessage({
                message: 'Sent device logs request',
                messageType: 'information',
            })
    
            this.setState({deviceLogDialog: null})
            this.setState({deviceLogLimit: null})
            this.setState({deviceLogUrl: null})
        })
        
    }

    handleDeviceLogsCancel = (e) => {
        e.preventDefault();
        this.setState({deviceLogDialog: null})
    }

    handleDeviceLogsDialog = (e) => {
        e.preventDefault();
        var device = e.target.getAttribute('data-key');

        this.setState({deviceLogDialog: device})
    }

    renderRows(items) {
        return items.map((l) => {
            return (
                <TableRow key={l.registrationId}>
                    <TableCell component="th" scope="row">
                        <button onClick={this.handleDeviceLogsDialog}  className="small u-float" title={T("fetch logs")} data-key={l.deviceId}>
                            <i className="fa fa-download" aria-hidden="true" data-key={l.deviceId} />
                        </button>
                        {this.renderDelete(l)}
                    </TableCell>
                    <TableCell ><a href={'/devices/' + l.deviceId+ '/info'}>{l.brand}</a></TableCell>
                    <TableCell ><a href={'/devices/' + l.deviceId+ '/info'}>{l.model}</a></TableCell>
                    <TableCell ><a href={'/devices/' + l.deviceId+ '/info'}>{l.serial}</a></TableCell>
                    <TableCell >{moment(l.created).tz(local_tz).format('lll z')}</TableCell>
                    <TableCell>
                        {moment(l.lastRefresh).tz(local_tz).format('lll z')}
                        &nbsp;
                        {this.getAge(l.lastRefresh)}
                    </TableCell>
                </TableRow>
            )
        });
    }

    handleMessage = (message) => {
        this.setState(message)
    }

    render () {
        return (
            <div className="row">
                <section className="row">
                    <h2>{T('devices-connected')}</h2>
                    <div className="col-12">
                        <AlertBox message={this.state.message} type={this.state.messageType}/>
                    </div>
                </section>

                <section className="row spacer">
                    {this.renderTable(this.props.devices)}
                </section>
            </div>
        )
    }

}

export default Devices;