import React, {
  useState
} from 'react';
import {
  Tabs,
  Tab,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  useHistory
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import Product from './modules/components/dashboard/Product';
import Tax from './modules/components/dashboard/Tax';
import Category from './modules/components/dashboard/Category';
import SaleReport from './modules/components/dashboard/Sale';
import InventoryReport from './modules/components/dashboard/Inventory';
import { classNames } from '../utils';

const Dashboard = () => {
  const [value, setValue] = useState(2);
  const history = useHistory();
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="dashboard">
      <React.Fragment>
        <AppAppBar />
        <Grid container spacing={3} >
          <Grid item xs={3}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className="tabs"
            >
              <Tab label={ t('sale.heading') } onClick={() => history.push('/sale')}/>
              <div className="heading">
                <Typography variant="subtitle1">
                  { t('store.heading') }
                </Typography>
              </div>
              <Tab label={ t('product.heading') } className="sub-item"/>
              <Tab label={ t('category.heading') } className="sub-item"/>
              <Tab label={ t('tax.heading') } className="sub-item"/>
              <div className="heading">
                <Typography variant="subtitle1">
                  { t('report.heading') }
                </Typography>
              </div>
              <Tab label={ t('sale.heading') } className="sub-item"/>
              <Tab label={ t('inventory.heading') } className="sub-item"/>
            </Tabs>
          </Grid>
          <Grid item xs={9}>
            <TabPanel value={value} index={2} className="product-tab">
              <Product/>
            </TabPanel>
            <TabPanel value={value} index={3} className="category-tab">
              <Category/>
            </TabPanel>
            <TabPanel value={value} index={4} className="tax-tab">
              <Tax/>
            </TabPanel>
            <TabPanel value={value} index={6} className="sale-report-tab">
              <SaleReport/>
            </TabPanel>
            <TabPanel value={value} index={7} className="inventory-report-tab">
              <InventoryReport/>
            </TabPanel>
          </Grid>
        </Grid>
      </React.Fragment>
    </div>
  );
}

const TabPanel = ({ children, index, value, className = '' }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={classNames(['tab-panel', className])}
    >
      {value === index && (
        <div className="content">
          {children}
        </div>
      )}
    </div>
  );
}

export default withRoot(Dashboard);
