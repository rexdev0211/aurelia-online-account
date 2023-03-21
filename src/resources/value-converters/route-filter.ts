export class RouteFilterValueConverter {
  toView(value) {
    return value.routes.filter(x => x.nav && x.route && x.route.length > 0)
  }
}

