package com.ohgiraffers.springdatajpa.controller;

import com.ohgiraffers.springdatajpa.common.ResponseMessage;
import com.ohgiraffers.springdatajpa.dto.MenuDTO;
import com.ohgiraffers.springdatajpa.service.MenuService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService menuService;

    // @Autowired를 작성하지 않아도 자동 적용됨을 잊지 말자.
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    /* 목차. 1. 모든 메뉴 조회 */
    @GetMapping
    public ResponseEntity<ResponseMessage> findAllMenus() {

        List<MenuDTO> menus = menuService.findAllMenus();
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("menus", menus);
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(),
                "메뉴 목록 조회 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
    }

    /* 목차. 2. 페이징 처리된 메뉴 목록 조회 */
    /**
     * 주어진 Pageable 정보를 바탕으로 메뉴 리스트를 조회하고, 페이지네이션 정보를 포함한 응답을 반환한다.
     *
     * <p>{@link org.springframework.data.domain.Pageable} 객체를 인자로 받아 페이지 요청 정보를
     * 처리한다. @PageableDefault 어노테이션을 통해 기본 페이지 설정을 지정할 수 있다.</p>
     *
     * @param pageable {@link org.springframework.data.domain.Pageable} 객체로, 페이지 번호, 크기, 정렬 정보를 관리한다.
     * @return 페이징 처리된 메뉴 목록과 페이지 정보를 포함한 ResponseEntity 객체
     */
    @GetMapping("/pages")
    public ResponseEntity<ResponseMessage> findMenuPage(@PageableDefault Pageable pageable) {

        System.out.println("pageable = " + pageable);

        Page<MenuDTO> menuPage = menuService.findMenuList(pageable);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("content", menuPage.getContent());              // 현재 페이지의 데이터
        resultMap.put("totalElements", menuPage.getTotalElements());  // 전체 데이터 수
        resultMap.put("totalPages", menuPage.getTotalPages());        // 전체 페이지 수
        resultMap.put("size", menuPage.getSize());                    // 페이지 크기
        /* 설명. one-indexed-parameters 설정은 '요청'의 page 파라미터에만 적용된다.
         *  Page.getNumber()는 여전히 0부터 시작하므로, 요청과 응답의 기준을 맞추기 위해 +1 해서 내려준다.
         * */
        resultMap.put("number", menuPage.getNumber() + 1);            // 현재 페이지 번호(1부터 시작)
        resultMap.put("first", menuPage.isFirst());                   // 첫 페이지 여부
        resultMap.put("last", menuPage.isLast());                     // 마지막 페이지 여부
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(),
                "페이징 처리된 메뉴 목록 조회 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
    }

    /* 목차. 3. 정렬 기능이 추가된 페이징 처리 메뉴 목록 조회 */
    /**
     * 사용자가 지정한 페이지, 크기, 정렬 기준, 정렬 방향에 따라 메뉴 목록을 조회한다.
     * 
     * <p>클라이언트에서 전달한 파라미터로 페이징 및 정렬을 적용하여 메뉴 목록을 조회하고,
     * 결과를 반환한다. 정렬 기준과 방향을 동적으로 지정할 수 있다.</p>
     *
     * <p>페이지 번호와 크기는 위 findMenuPage()와 동일하게 Pageable로 받는다.
     * 그래야 one-indexed-parameters 설정이 두 엔드포인트에 똑같이 적용되어
     * 같은 page 값이 항상 같은 페이지를 가리키게 된다.
     * (page와 size를 int로 직접 받으면 이 설정이 적용되지 않아 두 API의 기준이 어긋난다)</p>
     *
     * @param pageable 페이지 번호와 크기를 담은 Pageable 객체 (기본 크기: 5)
     * @param sortBy 정렬 기준 필드 (기본값: menuPrice)
     * @param direction 정렬 방향 (asc 또는 desc, 기본값: asc)
     * @return 페이징 및 정렬이 적용된 메뉴 목록과 페이지 정보를 포함한 ResponseEntity 객체
     */
    @GetMapping("/pages/sort")
    public ResponseEntity<ResponseMessage> findMenuPageWithSort(
            @PageableDefault(size = 5) Pageable pageable,
            @RequestParam(defaultValue = "menuPrice") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        // 정렬 방향 설정
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ?
                Sort.Direction.DESC : Sort.Direction.ASC;

        // 정렬 객체 생성
        Sort sort = Sort.by(sortDirection, sortBy);

        // 페이징 처리된 메뉴 조회
        Page<MenuDTO> menuPage = menuService.findMenuListWithSort(pageable, sort);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("content", menuPage.getContent());              // 현재 페이지의 데이터
        resultMap.put("totalElements", menuPage.getTotalElements());  // 전체 데이터 수
        resultMap.put("totalPages", menuPage.getTotalPages());        // 전체 페이지 수
        resultMap.put("size", menuPage.getSize());                    // 페이지 크기
        /* 설명. one-indexed-parameters 설정은 '요청'의 page 파라미터에만 적용된다.
         *  Page.getNumber()는 여전히 0부터 시작하므로, 요청과 응답의 기준을 맞추기 위해 +1 해서 내려준다.
         * */
        resultMap.put("number", menuPage.getNumber() + 1);            // 현재 페이지 번호(1부터 시작)
        resultMap.put("first", menuPage.isFirst());                   // 첫 페이지 여부
        resultMap.put("last", menuPage.isLast());                     // 마지막 페이지 여부
        resultMap.put("sort", sortBy);                                // 정렬 기준 필드
        resultMap.put("direction", direction);                        // 정렬 방향
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(),
                "페이징 처리 및 정렬이 적용된 메뉴 목록 조회 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
    }

    /* 목차. 4. 메뉴 코드로 단일 메뉴 조회 */
    /**
     * 메뉴 코드에 해당하는 단일 메뉴를 조회한다.
     * 
     * <p>경로 변수로 전달된 메뉴 코드를 사용하여 메뉴를 조회하고, 결과를 반환한다.</p>
     *
     * @param menuCode 조회할 메뉴의 코드 (PK)
     * @return 조회된 메뉴 정보를 포함한 ResponseEntity 객체
     */
    @GetMapping("/{menuCode}")
    public ResponseEntity<ResponseMessage> findMenuByCode(@PathVariable int menuCode) {

        MenuDTO menu = menuService.findMenuByCode(menuCode);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("menu", menu);
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(),
                "메뉴 상세 조회 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
    }

    /* 목차. 5. 가격 기준 메뉴 검색 */
    /**
     * 지정된 가격을 초과하는 메뉴 목록을 조회한다.
     * 
     * <p>쿼리 파라미터로 전달된 가격보다 높은 가격의 메뉴 목록을 조회하고, 결과를 반환한다.</p>
     *
     * @param menuPrice 기준 가격
     * @return 기준 가격을 초과하는 메뉴 목록을 포함한 ResponseEntity 객체
     */
    @GetMapping("/search")
    public ResponseEntity<ResponseMessage> findMenusByPrice(@RequestParam Integer menuPrice) {

        List<MenuDTO> menus = menuService.findMenusByPrice(menuPrice);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("menus", menus);
        resultMap.put("searchPrice", menuPrice);
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(),
                menuPrice + "원 초과 메뉴 목록 조회 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
    }

    /* 목차. 6. 새 메뉴 등록 */
    /**
     * 새로운 메뉴를 등록한다.
     * 
     * <p>요청 본문으로 전달된 메뉴 정보를 사용하여 새 메뉴를 등록하고, 등록된 메뉴 정보를 반환한다.</p>
     *
     * @param menuDTO 등록할 메뉴 정보
     * @return 등록된 메뉴 정보를 포함한 ResponseEntity 객체
     */
    @PostMapping // 특정 정보를 새로 등록할 목적으로 사용할 클래스임을 지정하는 어노테이션.
    public ResponseEntity<ResponseMessage> saveMenu(@RequestBody MenuDTO menuDTO) {

        MenuDTO savedMenu = menuService.saveMenu(menuDTO);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("menu", savedMenu);
        // "menu"라는 이름의 정보를 savedMenu라는 저장소에 등록할 것이다.
        // put()메소드는 주로 Map에서 사용되고, Key와 Value를 저장하는 데 사용된다.
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.CREATED.value(),
                "메뉴 등록 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(responseMessage);
    }

    /* 목차. 7. 메뉴 수정 */
    /**
     * 지정된 메뉴 코드의 메뉴 정보를 수정한다.
     * 
     * <p>경로 변수로 전달된 메뉴 코드와 요청 본문으로 전달된 메뉴 정보를 사용하여 
     * 기존 메뉴를 수정하고, 수정된 메뉴 정보를 반환한다.</p>
     *
     * @param menuCode 수정할 메뉴의 코드 (PK)
     * @param menuDTO 수정할 메뉴 정보
     * @return 수정된 메뉴 정보를 포함한 ResponseEntity 객체
     */
    @PutMapping("/{menuCode}") // PutMapping은 지정된 코드의 정보를 수정하겠다는 어노테이션.
    public ResponseEntity<ResponseMessage> updateMenu(
            @PathVariable int menuCode, // PathVariable은 Path(경로)를 설정해주는 어노테이션.
            @RequestBody MenuDTO menuDTO
            // RequestBody는 HTTP 요청의 본문(body) 데이터를 Java 객체로 변환해서 컨트롤러 메서드 파라미터에 넣어주는 어노테이션.(GPT)
            // "는 HTTP요청의 본문을 MenuDTO를 객체로 가져가겠다. 하는 어노테이션(나)
    ) {

        MenuDTO updatedMenu = menuService.updateMenu(menuCode, menuDTO);
        
        Map<String, Object> resultMap = new HashMap<>();
        // Map 객체를 생성할건데, 문자열 자료형과 object(최상위 자료형이기 때문에 모든 자료형이 올 수 있음)을 Key와 Value로 받겠다. 하는 ResultMap을 선언.
        resultMap.put("menu", updatedMenu); // MenuDTO에서 가져온 updatedMenu를 menu라는 이름으로 수정하겠다.
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(), //HTTP요청 상태가 정상이라면, 정상 상태코드인 200을 출력하게 된다. 그래서 ResponseMessege 클래스에서는 int 자료형을 사용하여 매개변수로 받음.
                "메뉴 수정 성공", // "메뉴 수정 성공"이라는 메세지를 출력하겠다.
                resultMap // 아래 주석 참고하여 파라미터 던질 수 있다.
        );
         /*public ResponseMessage(int httpStatus, String message, Map<String, Object> result) {
            this.httpStatus = httpStatus;
            this.message = message;
            this.result = result;
        }*/
        /* ResponseMessege라는 클래스에서 매개변수 있는 생성자를 호출한다.
        *  HTTP 요청 상태가 정상이면 200을 반환하므로 int, 출력할 메세지는 문자열로, 결과의 Map을 매개변수로 받는다.
        * */
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
        // 응답 상태코드를 정상인 200을 담고, responseMessege를 반환하여 응답 본문에 넣는다.
    }

    /* 목차. 8. 메뉴 삭제 */
    /**
     * 지정된 메뉴 코드의 메뉴를 삭제한다.
     * 
     * <p>경로 변수로 전달된 메뉴 코드에 해당하는 메뉴를 삭제하고, 삭제 결과를 반환한다.</p>
     *
     * @param menuCode 삭제할 메뉴의 코드 (PK)
     * @return 삭제된 메뉴 코드를 포함한 ResponseEntity 객체
     */
    @DeleteMapping("/{menuCode}") // 삭제 요청을 던지는 클래스임을 지정하는 어노테이션
    public ResponseEntity<ResponseMessage> deleteMenu(@PathVariable int menuCode) {

        menuService.deleteMenu(menuCode);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("deletedMenuCode", menuCode);
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.NO_CONTENT.value(), //요청은 정상적으로 처리됐지만, 응답 본문에 보낼 데이터는 없다. 204코드를 의미함.
                "메뉴 삭제 성공", // 삭제 성공 시 출력할 문자열
                resultMap
        );
        
        return ResponseEntity
                // 실제 NO_CONTENT(204)는 응답 바디를 포함하지 않으므로 OK(200)로 변경
                .status(HttpStatus.OK)
                .body(responseMessage);
    }
}
