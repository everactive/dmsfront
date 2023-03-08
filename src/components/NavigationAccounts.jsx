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
import {T, isLoggedIn} from './Utils'


class NavigationAccounts extends Component {
    handleAccountChange = (e) => {
        e.preventDefault()

        // Get the account
        var accountId = e.target.value;
        var account = this.props.accounts.filter(a => {
            return a.orgid === accountId
        })[0]

        this.props.onAccountChange(account)
    }

    renderAccounts(token) {
        if (!isLoggedIn(token)) {
            return <span />
        }

        if (this.props.accounts.length === 0) {
            return <span />
        }

        return (
            <li className="p-navigation__item">
                <form id="account-form">
                    <select value={this.props.selectedAccount.orgid} onChange={this.handleAccountChange}>
                        {this.props.accounts.map(a => {
                            return <option key={a.orgid} value={a.orgid} selected={a.orgid===this.props.selectedAccount.orgid}>{a.name}</option>;
                        })}
                    </select>
                </form>
            </li>
        )
    }

    render() {

        var token = this.props.token

        return (
                <ul className="p-navigation__items">
                    {this.renderAccounts(token)}
                </ul>
        );
    }
}

export default NavigationAccounts;
