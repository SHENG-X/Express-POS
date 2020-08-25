import React, {
  useState
} from 'react';
import {
  IconButton,
  Button,
  withStyles,
} from '@material-ui/core';
import {
  Add,
  Remove,
  Delete
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Paper from './Paper';
import Typography from './Typography';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});
const mockProducts = [ 
  {
    _id: '2314124124131232214',
    name: 'Chai Tea Latte',
    count: 1,
    price: 12.45
  },
  {
    _id: '2314123412413654121',
    name: 'Milk Latte',
    count: 1,
    price: 8.45
  },
  {
    _id: '2986753412413654121',
    name: 'Dark Roast',
    count: 2,
    price: 4.45
  },
];

const Receipt = () => {
  const [products, setProducts] = useState(mockProducts);
  const [tax] = useState({
    rate: 0.12,
    enable: true
  });
  const { t } = useTranslation();

  const deleteProduct = (pid) => {
    const newProducts = products.filter(prod => prod._id !== pid);
    setProducts(newProducts);
  }

  const addRemoveProduct = (action, pid) => {
    let base = 1;
    if (action === 'remove') {
      base = -1;
    }
    const newProducts = products.map(prod => {
      if (prod._id === pid) {
        if (prod.count + base < 1) {
          return prod;
        }
        prod.count += base;
        return prod;
      }
      return prod;
    });
    setProducts(newProducts);
  }

  const calcSubtotal = () => {
    return products.reduce((res, prod) => res += prod.count * prod.price, 0).toFixed(2);
  }

  const calcTax = () => {
    return (tax.rate * Number(calcSubtotal())).toFixed(2);
  }

  const calcTotal = () => {
    return (Number(calcSubtotal()) + Number(calcTax())).toFixed(2);
  }

  return (
    <Paper
      elevation={3}
      className={styles.paper}
    >
      <div className="receipt">
        <div className="heading row">
          <div className="col-qty">
            <Typography variant="subtitle1">
              { t('sale.quantity') }
            </Typography>
          </div>
          <div className="col-product">
            <Typography variant="subtitle1">
              { t('sale.product') }
            </Typography>
          </div>
          <div className="col-price">
            <Typography variant="subtitle1">
              { t('sale.price') }
            </Typography>
          </div>
          <div className="col-total">
            <Typography variant="subtitle1">
              { t('sale.amount') }
            </Typography>
          </div>
          <div className="col-del">
            <Typography variant="subtitle1">
              { t('sale.del') }
            </Typography>
          </div>
        </div>
        <div className="content">
        {
          products.map(prod => <ReceiptItem product={prod} addRemoveProduct={addRemoveProduct} deleteProduct={deleteProduct} key={prod._id} />)
        }
        </div>
        <div className="footer">
          {
            tax.enable ? 
            <React.Fragment>
              <div className="row">
                <div className="col-label">
                  <Typography variant="subtitle2">
                    { t('sale.subtotal') }
                  </Typography>
                </div>
                <div className="col-amount">
                  <Typography variant="body2">
                    { calcSubtotal() }
                  </Typography>
                </div>
              </div>
              <div className="row">
                <div className="col-label">
                  <Typography variant="subtitle2">
                    <span style={{'padding-right': '0.2rem'}}>
                      { t('sale.tax') }
                    </span> 
                    { tax.rate * 100 }%
                  </Typography>
                </div>
                <div className="col-amount">
                  <Typography variant="body2">
                    { calcTax() }
                  </Typography>
                </div>
              </div>
            </React.Fragment>
            :
            null
          }
          <div className="row">
            <div className="col-label">
              <Typography variant="subtitle2">
                { t('sale.total') }
              </Typography>
            </div>
            <div className="col-amount">
              <Typography variant="body1">
                { calcTotal() }
              </Typography>
            </div>
          </div>
          <div className="row">
            <Button>
              { t('common.cancel') }
            </Button>
            <Button>
              { t('common.save') }
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
}

const ReceiptItem = ({ product, addRemoveProduct, deleteProduct }) => {
  return (
    <div class="row">
      <div className="col-qty">
        <IconButton
          color="primary"
          size="small"
          aria-label="add one"
          onClick={() => addRemoveProduct('add', product._id)}
        >
          <Add />
        </IconButton>
        <Typography variant="subtitle2" align="center" className="count">
          { product.count }
        </Typography>
        <IconButton
          color="primary"
          size="small"
          aria-label="remove one"
          onClick={() => addRemoveProduct('remove', product._id)}
        >
          <Remove />
        </IconButton>
      </div>
      <div className="col-product">
        <Typography variant="body1">
          { product.name }
        </Typography>
      </div>
      <div className="col-price">
        <Typography variant="body1">
          { product.price.toFixed(2) }
        </Typography>
      </div>
      <div className="col-total">
        <Typography variant="body1">
          { (product.count * product.price).toFixed(2) }
        </Typography>
      </div>
      <div className="col-del">
        <IconButton
          color="primary"
          size="small"
          aria-label="delete"
          onClick={() => deleteProduct(product._id) }
        >
          <Delete />
        </IconButton>
      </div>
    </div>
  );
}

export default withStyles(styles)(Receipt);