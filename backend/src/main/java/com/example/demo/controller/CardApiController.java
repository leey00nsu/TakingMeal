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
public class CardApiController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping("/cardapi")
    public String cardApiParsing() throws ParseException {

        //f9e392fd-09bb-4812-b065-d6529bd4ce60?
        //f9e392fd-09bb-4812-b065-d6529bd4ce60?

        //http://api.odcloud.kr/api/15088598/v1/uddi:f9e392fd-09bb-4812-b065-d6529bd4ce60?page=1&perPage=1000&serviceKey=lVX6pCPBXvEPJH0B%2Fhz3DzuxI1kWQwyNxoHN%2FXRYacniM0RIPYXCb%2F%2FTazHtx4d8iwGWFMB%2FAH%2Fg6983drsahw%3D%3D
        StringBuilder sb = new StringBuilder();
        JSONObject result = null;
        try {
            StringBuilder urlBuilder = new StringBuilder("http://api.odcloud.kr/api/15088598/v1/uddi:f9e392fd-09bb-4812-b065-d6529bd4ce60"); /*URL*/
//            urlBuilder.append("&" + URLEncoder.encode("desc_kor", "UTF-8") + "=" + URLEncoder.encode("피자", "UTF-8")); /*페이지 번호*/
            urlBuilder.append("?" + URLEncoder.encode("page", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*페이지 번호*/
            urlBuilder.append("&" + URLEncoder.encode("perPage", "UTF-8") + "=" + URLEncoder.encode("100", "UTF-8")); /*한 페이지 결과수*/
//            urlBuilder.append("&type=json"); /*결과 json 포맷*/
            urlBuilder.append("&" + URLEncoder.encode("serviceKey", "UTF-8") + "=lVX6pCPBXvEPJH0B%2Fhz3DzuxI1kWQwyNxoHN%2FXRYacniM0RIPYXCb%2F%2FTazHtx4d8iwGWFMB%2FAH%2Fg6983drsahw%3D%3D"); /*Service Key*/

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

        } catch (Exception e) {
            e.printStackTrace();
        }

        //return sb.toString() + "";

        try {
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(sb.toString());
            JSONArray data = (JSONArray)jsonObject.get("data");
//            JSONArray items = (JSONArray)body.get("items");

            for (int i = 0; i < data.size(); i++) {

                //배열 안에 있는것도 JSON형식 이기 때문에 JSON Object 로 추출
                JSONObject object = (JSONObject) data.get(i);

                if (object.get("위도") == null || object.get("경도") == null) continue;

                //JSON name으로 추출
                String storeName = (String)object.get("가맹점명");
                String storeAddress = (String)object.get("가맹점주소");
//                String lat = (String) object.get("위도");
//                String lng = (String) object.get("경도");
                Double lat = Double.parseDouble((String) object.get("위도"));
                Double lng = Double.parseDouble((String) object.get("경도"));

//                System.out.println(storeName);
//                System.out.println(storeAddress);
//                System.out.println(lat);
//                System.out.println(lng);
//
//                System.out.println();
                LocationApiDTO locationApiDTO = new LocationApiDTO(storeName, storeAddress, lat, lng, StoreCategory.CARD);
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
