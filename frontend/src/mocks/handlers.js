import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/jsonapi', () => {
    return HttpResponse.json({
      meta: { links: { me: { href: 'http://localhost/jsonapi/user/user/123' } } }
    });
  }),
  http.post('*/user/login', () => {
    return HttpResponse.json({
      current_user: { uid: "1", name: "logintest@example.com" },
      csrf_token: "test_token",
      logout_token: "test_logout"
    });
  }),
  http.get('*/jsonapi/user/user/123', () => {
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
