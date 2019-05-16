import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Divider from 'material-ui/Divider'

require('styles/buckless/BarStats.scss')

export default class BarStats extends React.Component {
  constructor(props) {
    super(props)
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
    const { sells, reloads } = this.props.team
    if (!sells) return null
    let result = JSON.parse(sells).map(item => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        totalTI: parseInt(item.totalTI),
        count: parseInt(item.count),
        isCancellation: item.isCancellation
      }
    })
    let soldItems = result.filter(item => !item.isCancellation)
    let cancellation = result.filter(item => item.isCancellation)
    cancellation.forEach(item => {
      let index = soldItems.findIndex(i => i.name === item.name)
      soldItems[index].count -= item.count
      soldItems[index].totalTI -= item.totalTI
    })
    result = JSON.parse(reloads).map(item => {
      return {
        id: item.id,
        type: item.type,
        credit: parseInt(item.credit),
        isCancellation: item.isCancellation
      }
    })
    let reloadItems = []
    result.forEach(item => {
      if (!reloadItems[item.type]) reloadItems[item.type] = item
      else
        reloadItems[item.type].credit +=
          item.credit * (item.isCancellation ? -1 : 1)
    })
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
        {soldItems.map(row => (
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
        <Divider />
        <Row className='Header'>
          <Col xs={12} sm={6}>
            Type
          </Col>
          <Col xs={12} sm={6}>
            Crédit
          </Col>
        </Row>
        {Object.values(reloadItems).map(row => (
          <Row key={row.id}>
            <Col xs={12} sm={6}>
              {row.type}
            </Col>
            <Col xs={12} sm={6}>
              {this.price(row.credit)}
            </Col>-
          </Row>
        ))}
      </div>
    )
  }
}
