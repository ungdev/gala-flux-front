import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Divider from 'material-ui/Divider'



require('styles/buckless/BarStats.scss')

export default class BarStats extends React.Component {

  constructor(props) {
    super(props);
    this.price = this.price.bind(this)
}

  price(p) {
    let res = `${p}€`
    String.prototype.splice = function(idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
    }
    res = res.splice(res.length - 3, 0, '.')
    return res[0] == '.' ? '0' + res : res
  }

  render() {
    const { stats } = this.props.team
    if(!stats) return null
    const result = JSON.parse(stats).map(item => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        totalTI: parseInt(item.totalTI),
        count: parseInt(item.count),
        isCancellation: item.isCancellation
      }
    })
    let items = result.filter(item => !item.isCancellation)
    const cancellation = result.filter(item => item.isCancellation)
    cancellation.forEach(item => {
      let index = items.findIndex(i => i.name === item.name)
      items[index].count -= item.count
      items[index].totalTI -= item.totalTI
    });
    return (
      <div className='BarStats'>
        <Divider />
        <Row className='Header'>
          <Col xs={12} sm={5}>
            Item
          </Col>
          <Col xs={12} sm={3}>
            Quantité
          </Col>
          <Col xs={12} sm={2}>
            Prix
          </Col>
          <Col xs={12} sm={2}>
            Total
          </Col>
        </Row>
        {items.map(row => (
          <Row key={row.id}>
            <Col xs={12} sm={5}>
              {row.name}
            </Col>
            <Col xs={12} sm={3}>
              {row.count}
            </Col>
            <Col xs={12} sm={2}>
              {this.price(row.price)}
            </Col>
            <Col xs={12} sm={2}>
              {this.price(row.totalTI)}
            </Col>
          </Row>
        ))}
      </div>
    )
  }
}
