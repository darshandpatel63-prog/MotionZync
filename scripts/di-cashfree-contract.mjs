import assert from 'node:assert/strict'

process.env.CASHFREE_ENV='sandbox'
process.env.CASHFREE_CLIENT_ID='ci-client-id'
process.env.CASHFREE_CLIENT_SECRET='ci-client-secret'

let calls=0
let lastRequest=null

globalThis.fetch=async (url,options={})=>{
  calls+=1
  lastRequest={url,options}
  return new Response(JSON.stringify({
    payment_session_id:'ci-payment-session',
    order_status:'ACTIVE',
  }),{
    status:200,
    headers:{'content-type':'application/json'},
  })
}

const {createCashfreeOrder}=await import('../api/_lib/cashfree.js')

const validOrder=await createCashfreeOrder({
  orderId:'ci-order-valid',
  amount:200,
  currency:'INR',
  customerId:'ci-user',
  customerEmail:'customer@example.com',
  customerPhone:'+919876543210',
  customerName:'CI Customer',
  plan:'ultra-premium',
  returnUrl:'https://motion-zync.vercel.app/design-intelligence/pricing?payment=returned&order_id={order_id}',
  notifyUrl:'https://motion-zync.vercel.app/api/cashfree-webhook',
})

assert.equal(validOrder.payment_session_id,'ci-payment-session')
assert.equal(calls,1)

const payload=JSON.parse(lastRequest.options.body)
assert.equal(payload.order_amount,200)
assert.equal(payload.order_currency,'INR')
assert.equal(payload.customer_details.customer_phone,'+919876543210')
assert.equal(payload.customer_details.customer_email,'customer@example.com')
assert.equal(payload.order_tags.motionzync_plan,'ultra-premium')
assert.equal(payload.order_tags.motionzync_user_id,'ci-user')
assert.match(payload.order_meta.return_url,/\{order_id\}/)
assert.match(payload.order_meta.notify_url,/cashfree-webhook$/)

await assert.rejects(
  () => createCashfreeOrder({
    orderId:'ci-order-invalid-phone',
    amount:200,
    currency:'INR',
    customerId:'ci-user',
    customerEmail:'customer@example.com',
    customerPhone:'abc',
    plan:'ultra-premium',
    returnUrl:'https://motion-zync.vercel.app/design-intelligence/pricing?order_id={order_id}',
    notifyUrl:'https://motion-zync.vercel.app/api/cashfree-webhook',
  }),
  /valid customer phone number/i,
)

await assert.rejects(
  () => createCashfreeOrder({
    orderId:'ci-order-invalid-email',
    amount:200,
    currency:'INR',
    customerId:'ci-user',
    customerEmail:'not-an-email',
    customerPhone:'+919876543210',
    plan:'ultra-premium',
    returnUrl:'https://motion-zync.vercel.app/design-intelligence/pricing?order_id={order_id}',
    notifyUrl:'https://motion-zync.vercel.app/api/cashfree-webhook',
  }),
  /valid authenticated customer email/i,
)

assert.equal(calls,1,'Invalid customer inputs must be rejected before contacting Cashfree')
console.log('Cashfree server order contract passed')
