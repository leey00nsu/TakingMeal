package com.example.demo.controller;

import com.example.demo.dto.LocationApiDTO;
import com.example.demo.entity.Location;
import com.example.demo.entity.StoreCategory;
import com.example.demo.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

@RestController
@RequiredArgsConstructor
@Slf4j
public class GoodInfluenceStoreApiController {
    @Autowired
    private LocationRepository locationRepository;

    @GetMapping("/storeapi")
    public String goodInfluenceStoreApiParsing() throws ParseException {



        //http://apis.data.go.kr/1471000/FoodNtrIrdntInfoService1/getFoodNtrItdntList1?serviceKey=PE40pSyADxUOfX1WI2BhawGnknXrz6LfLp3NzD5qTJrcO1czoJKlgwuaF5pTsGodQ%2BtD81f%2FXXSZgSZ%2B728Brg%3D%3D&
        // desc_kor=%ED%94%BC%EC%9E%90&
        // pageNo=1&numOfRows=100&
        // type=xml

        //https://map.seoul.go.kr/smgis/apps/theme.do?cmd=getContentsList&key=3fb1ed1895024e1ab4b910b5dcc8b2f9&page_size=1000&page_no=1&coord_x=126.974695&coord_y=37.564150&distance=2000&search_type=0&search_name=&theme_id=11102795&content_id=&subcate_id=
        StringBuilder sb = new StringBuilder();
        JSONObject result = null;
        try {
            StringBuilder urlBuilder = new StringBuilder("https://map.seoul.go.kr/smgis/apps/theme.do"); /*URL*/
            urlBuilder.append("?" + URLEncoder.encode("cmd", "UTF-8") + "=getContentsList"); /*cmd*/
            urlBuilder.append("&" + URLEncoder.encode("key", "UTF-8") + "=3fb1ed1895024e1ab4b910b5dcc8b2f9"); /*key*/
            urlBuilder.append("&" + URLEncoder.encode("page_size", "UTF-8") + "=" + URLEncoder.encode("100", "UTF-8")); /*v페이지 크기*/
            urlBuilder.append("&" + URLEncoder.encode("page_no", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*페이지 번호*/
            urlBuilder.append("&" + URLEncoder.encode("coord_x", "UTF-8") + "=" + URLEncoder.encode("126.974695", "UTF-8")); /*x좌표(경도)*/
            urlBuilder.append("&" + URLEncoder.encode("coord_y", "UTF-8") + "=" + URLEncoder.encode("37.564150", "UTF-8")); /*y좌표(위도)*/
            urlBuilder.append("&" + URLEncoder.encode("distance", "UTF-8") + "=" + URLEncoder.encode("2000", "UTF-8")); /*distance*/
            urlBuilder.append("&" + URLEncoder.encode("search_type", "UTF-8") + "=" + URLEncoder.encode("0", "UTF-8")); /*search_type*/
            urlBuilder.append("&" + URLEncoder.encode("search_name", "UTF-8") + "="); /*search_name*/
            urlBuilder.append("&" + URLEncoder.encode("theme_id", "UTF-8") + "=" + URLEncoder.encode("11102795", "UTF-8")); /*theme_id*/
            urlBuilder.append("&" + URLEncoder.encode("content_id", "UTF-8") + "="); /*content_id*/
            urlBuilder.append("&" + URLEncoder.encode("subcate_id", "UTF-8") + "="); /*subcate_id*/
            urlBuilder.append("&type=json"); /*결과 json 포맷*/

            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            BufferedReader rd;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }
            String line;
            while ((line = rd.readLine()) != null) {
                sb.append(line + "\n");

            }
            rd.close();
            conn.disconnect();
//            System.out.println(sb.toString().getClass().getName());
//            System.out.println("hello world");
        } catch (Exception e) {
            e.printStackTrace();
        }

        //return sb.toString() + "";

        try {
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(sb.toString());
            System.out.println(1);
            JSONArray body = (JSONArray)jsonObject.get("body");
            System.out.println(body.size());
//            JSONArray items = (JSONArray)body.get("items");

            for (int i = 0; i < body.size(); i++) {

                //배열 안에 있는것도 JSON형식 이기 때문에 JSON Object 로 추출
                JSONObject object = (JSONObject) body.get(i);

                if(object.get("COT_COORD_X") == null || object.get("COT_COORD_Y") == null) continue;

                String storeName = (String)object.get("COT_CONTS_NAME");
                String storeAddress = (String) object.get("COT_ADDR_FULL_NEW");
                Double lat = Double.parseDouble((String) object.get("COT_COORD_Y"));
                Double lng = Double.parseDouble((String) object.get("COT_COORD_X"));

                //JSON name으로 추출
//                System.out.println("가맹점명 ==> " + object.get("COT_CONTS_NAME"));
//                System.out.println("가맹점주소 ==> " + object.get("COT_ADDR_FULL_NEW"));
//                System.out.println("위도 ==> " + object.get("COT_COORD_Y"));
//                System.out.println("경도 ==> " + object.get("COT_COORD_X"));
//
//                System.out.println("");

                LocationApiDTO locationApiDTO = new LocationApiDTO(storeName, storeAddress, lat, lng, StoreCategory.GOOD);
                Location entity = new Location(locationApiDTO);
                locationRepository.save(entity);

            }
        } catch (ParseException e) {

        }


//JSON데이터를 넣어 JSON Object 로 만들어 준다.


//배열 추출
        return null;
    }

    /*@GetMapping("/test")
    public String test(){
        System.out.println("test");
        return null;
    }*/
}
