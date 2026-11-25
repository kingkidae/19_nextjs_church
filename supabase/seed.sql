-- 초기 데이터. 비어 있을 때만 들어가므로 여러 번 실행해도 관리자가 고친 내용을 덮어쓰지 않는다.

insert into public.site_settings (key, value) values ('church', '{"name":"대구신현교회","denomination":"대한예수교장로회 합동 동대구노회","founded":"1971","address":"대구 북구 경대로19길 55-5","phone":"053-939-1004","directions":"경북대학교 동문, 테크노문에서 5분 거리입니다.","parking":"주차장이 협소하여 주일에는 복잡할 수 있습니다. 어울림쉼터 주차장 또는 경북대 테크노문 담벼락(경대로17길)을 이용해 주세요.","naverDirections":"https://map.naver.com/p/directions/-/14317586.227653164,4285657.959234277,%EB%8C%80%EA%B5%AC%EC%8B%A0%ED%98%84%EA%B5%90%ED%9A%8C,,/-/transit?c=15.00,0,0,0,dh","naverPlace":"https://map.naver.com/p/entry/place/16137640?c=19.76,0,0,0,dh","mapEmbed":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3232.276762330749!2d128.61453957643002!3d35.89123677252033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565e198a4e3eeef%3A0x296ba0d78b00c491!2z7Iug7ZiE6rWQ7ZqM!5e0!3m2!1sko!2skr!4v1769062504154!5m2!1sko!2skr"}'::jsonb) on conflict (key) do nothing;

insert into public.site_settings (key, value) values ('theme', '{"title":"Revival 2026","sub":"신현 부흥역사, 네 번째 해","line1":"일어나라","line2":"빛을 발하라","rest1":"이는 네 빛이 이르렀고","rest2":"여호와의 영광이 네 위에 임하였음이니라","ref":"이사야 60:1"}'::jsonb) on conflict (key) do nothing;

insert into public.site_settings (key, value) values ('about', '{"vision":"하나님의 임재가 나타나는 교회가 되기를 소망합니다.","homeTitle":"하나님의 임재가\n나타나는 교회","summary":"하나님의 열심에 집중하고, 성화와 사명으로 때가 차기까지 지금도 달려갑니다.","healthy":"하나님을 예배의 중심에, 성경을 삶의 기준에, 교회를 신앙의 터전에 둡니다. 세 가지 중심이 서로를 붙들어 주는 교회를 꿈꿉니다.","centers":"하나님 중심, 성경 중심, 교회 중심","spirit":"대구와 한국 땅에 복음과 사랑으로 하나님 나라를 이루는 데 이바지하기를 열망합니다.","spiritShort":"대구와 한국 땅에 복음과 사랑으로","history":"하나님의 열심에 집중하고 성화와 사명으로, 때가 차기까지 지금도 달려갑니다."}'::jsonb) on conflict (key) do nothing;

insert into public.worship_times (grp, name, ampm, time, sort) select * from (values
  ('주일 예배', '새벽기도회', '오전', '5:30', 0),
  ('주일 예배', '1부 전통예배', '오전', '10:30', 1),
  ('주일 예배', '오후예배', '오후', '12:50', 2),
  ('주일 예배', '2부 찬양예배', '오후', '2:00', 3),
  ('주중 예배', '새벽기도회 (월–금)', '오전', '5:30', 4),
  ('주중 예배', '수요예배', '오후', '8:00', 5),
  ('주중 예배', '금요예배', '오후', '8:00', 6),
  ('주일학교', '영유치부', '오전', '11:30', 7),
  ('주일학교', '유초등부', '오전', '11:30', 8),
  ('주일학교', '중고등부', '오전', '9:00', 9),
  ('주일학교', '대학청년부', '오후', '2:00', 10)
) v where not exists (select 1 from public.worship_times);

insert into public.videos (youtube_id, title, grp, sort) select * from (values
  ('T8U15fYwoSM', '주일 1부 예배', '주일', 0),
  ('dV6KEGT4UXc', '주일 2부 예배', '주일', 1),
  ('yJRdfDXeaoI', '주일 오후 예배', '주일', 2),
  ('QCivvp453do', '새벽기도회', '주중', 3),
  ('aBQKooU4BpQ', '수요 예배', '주중', 4),
  ('03Cvxf3CGx0', '금요 예배', '주중', 5)
) v where not exists (select 1 from public.videos);

insert into public.site_settings (key, value) values ('social', '{"youtube":"https://www.youtube.com/@shinhyunchurch","instagram":"","threads":"","kakao":""}'::jsonb) on conflict (key) do nothing;
