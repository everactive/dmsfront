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
import Navigation from './Navigation';
import NavigationUser from './NavigationUser';
import NavigationAccounts from './NavigationAccounts';
class Header extends Component {

    render() {
        return (
            <header id="navigation" className="p-navigation">
                <div className="p-navigation__row">
                    <div className="p-navigation__banner">
                        <div className="p-navigation__tagged-logo">
                            <a className="p-navigation__link" href="#">
                                <div className="p-navigation__logo-tag">
                                    <img className="p-navigation__logo-icon"
                                         src="https://assets.ubuntu.com/v1/82818827-CoF_white.svg" alt="" />
                                </div>
                                <span className="p-navigation__logo-title">Ubuntu</span>
                            </a>
                        </div>
                        <a href="#navigation" className="p-navigation__toggle--open" title="menu" onClick={this.handleToggleMenu}>Menu</a>
                        <a href="#navigation-closed" className="p-navigation__toggle--close" title="close menu">Close
                            menu</a>
                    </div>
                    <nav className="p-navigation__nav" aria-label="Example sub navigation">
                        <span className="u-off-screen"><a href="#navigation">Jump to site</a></span>
                        <Navigation section={this.props.section} token={this.props.token} />
                        <NavigationAccounts token={this.props.token}
                                            accounts={this.props.accounts} selectedAccount={this.props.selectedAccount}
                                            onAccountChange={this.props.onAccountChange} ></NavigationAccounts>
                        <NavigationUser token={this.props.token}
                                        accounts={this.props.accounts} selectedAccount={this.props.selectedAccount}
                                        onAccountChange={this.props.onAccountChange} />
                    </nav>
                </div>
            </header>
        )
    }
}

export default Header;
