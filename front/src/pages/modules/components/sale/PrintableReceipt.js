import React, {
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../context/storeContext';

const PrintableReceipt = ({ orderId }) => {
  const { t } = useTranslation();
  const { storeState } = useContext(Context);
  const detail = storeState.orders.find(ord => ord._id === orderId);
  const subtotal = detail.products.reduce((acc, prod) => acc + prod.price * prod.count, 0);
  
  const calcDiscount = () => {
    if (!detail.discount) {
      return 0 ;
    }
    if (detail.discount.method === 'Amount') {
      return detail.discount.value * -1;
    }
    return subtotal * detail.discount.value * -1;
  }
  const tax = (detail.taxRate === 0 ? 0 : (subtotal + calcDiscount()) * detail.taxRate);
  const total = subtotal + tax;

  return (
    <div className="print">
      <div className="receipt-copy">
        <div className="header">
          <div className="name">
            { storeState.name }
          </div>
          <div className="type">
            <span>{ t('sale.type') }:</span>
            <span>
              { detail.paymentType }
            </span>
          </div>
          <div className="type">
            <span>{ `Cashier No.` }:</span>
            <span>
              { detail.processedBy.toString().padStart(5, '0') }
            </span>
          </div>
          <div>
            { new Date(detail.createdAt).toLocaleString() }
          </div>
        </div>
        <div className="main">
          {
            detail.products.map(prod => <PrintableReceiptItem prod={prod} key={prod.product}/>)
          }
          <div className="summary">
            {
              tax !== 0 && 
              <div className="subtotal row">
                <div>{ t('sale.subtotal') }</div>
                <div>
                  { subtotal.toFixed(2) }
                </div>
              </div>
            }
            {
              detail.discount &&
              <div className="discount row">
                <div>Discount</div>
                <div>
                  { calcDiscount().toFixed(2) }
                </div>
              </div>
            }
            {
              tax !== 0 && 
              <div className="tax row">
                <div>
                  { t('tax.heading') } { detail.taxRate * 100 }%
                </div>
                <div>
                  { tax.toFixed(2) }
                </div>
              </div>
            }
            <div className="total row">
              <div>{ t('sale.total') }</div>
              <div>{ (total + calcDiscount()).toFixed(2) }</div>
            </div>
          </div>
        </div>
        <div className="footer">
          {/* { t('common.thankYou') } */}
        </div>
      </div>
    </div>
  );
}

const PrintableReceiptItem = ({ prod }) => {
  const { storeState } = useContext(Context);
  const productName = storeState.products.find(product => product._id === prod.product).name;

  return (
    <div className="item">
      <div className="title">
        <div>{ productName }</div>
        <div>{ (prod.count * prod.price).toFixed(2) }</div>
      </div>
      <div className="subtitle">
        { prod.count } x { prod.price}
      </div>
    </div>
  );
}

export default PrintableReceipt;