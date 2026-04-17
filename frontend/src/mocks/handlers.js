import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post(/\/jsonapi$/, () => {
    return HttpResponse.json({
      meta: { links: { me: { href: 'http://localhost/jsonapi/user/user/123' } } }
    });
  }),
  http.post(/\/user\/login$/, () => {
    return HttpResponse.json({
      current_user: { uid: "1", name: "logintest@example.com" },
      csrf_token: "test_token",
      logout_token: "test_logout"
    });
  }),
  http.post(/\/oauth\/token$/, () => {
    return HttpResponse.json({
      access_token: "access_token",
      expires_in: 3600,
      token_type: "Bearer",
      scope: "global",
      refresh_token: "refresh_token"
    });
  }),
  http.post(/\/user\/register/, () => {
    return HttpResponse.json({
      uid: [{"value": 1}],
      name: [{"value": "lvnz097byi"}]
    });
  }),
  http.get(/\/jsonapi\/node\/board/, () => {
    return HttpResponse.json({
      data: []
    });
  }),
  http.get(/\/jsonapi\/me$/, () => {
    return HttpResponse.json({
      data: {
        id: '123',
        type: 'user--user',
        attributes: {
          display_name: 'logintest@example.com',
          drupal_internal__uid: 1
        }
      }
    });
  }),
  http.get(/\/jsonapi\/user\/user\/123$/, () => {
    return HttpResponse.json({
      data: {
        id: '123',
        type: 'user--user',
        attributes: {
          display_name: 'logintest@example.com',
          drupal_internal__uid: 1
        }
      }
    });
  })
];
