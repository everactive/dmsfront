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
import api from '../models/api';
import {T} from './Utils';


class Footer extends Component {

  constructor(props) {
      super(props)

      this.state = {
          versions: {}
      };

      this.getVersions();
  }

  getVersions() {
    api.versions().then(response => {
        this.setState({versions: response.data.versions})
    })
  }

  render() {
      const versions = Object.keys(this.state.versions).map(k => {
          return "[" + k + ": " + this.state.versions[k] + "]"
      });
    return (
      <footer className="spacer">
            <xsmall>{T('versions')}: {versions}</xsmall>
      </footer>
    );
  }
}

export default Footer;
