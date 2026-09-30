package swagger;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(
		name = "Swagger 테스트용 컨트롤러",
		description = "담당자님도 테스트 해볼 수 있습니다 ^^"
)
@RestController
@RequestMapping("/swagger")
public class SwaggerTestController {

	private List<UserDTO> users;

	public SwaggerTestController() {
		users = new ArrayList<>();
		
		users.add(new UserDTO(1, "user01", "pass01", "홍길동", new java.util.Date()));
		users.add(new UserDTO(2, "user02", "pass02", "유관순", new java.util.Date()));
		users.add(new UserDTO(3, "user03", "pass03", "이순신", new java.util.Date()));
	}

	@Operation(
			summary = "모든 사용자 조회",
			description = "시스템에 등록된 전체 사용자 정보를 조회합니다."
	)
	@ApiResponses(
			value = {
					@ApiResponse(responseCode = "200",
							description = "조회 성공",
							content = @Content(schema = @Schema(implementation = ResponseMessage.class))),
					@ApiResponse(responseCode = "500",
							description = "서버 오류",
							content = @Content(schema = @Schema(hidden = true)))
			}
	)
	@GetMapping("/users")
	public ResponseEntity<ResponseMessage> findAllUsers() {
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
		
		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("users", users);
		
		ResponseMessage responseMessage = new ResponseMessage(200, "조회 성공!", responseMap);
		
		return new ResponseEntity<>(responseMessage, headers, HttpStatus.OK);
	}

	@Operation(summary = "특정 사용자 조회", description = "사용자 번호를 통해 특정 사용자 정보를 조회합니다.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ResponseMessage.class))),
			@ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content(schema = @Schema(hidden = true))),
			@ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(hidden = true)))
	})
	@GetMapping(
			value = "/users/{userNo}",
	produces = MediaType.APPLICATION_JSON_VALUE
	)
	public ResponseEntity<ResponseMessage> findUserByNo(@PathVariable int userNo) {
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
		
		UserDTO foundUser = users.stream()
				.filter(user -> user.getNo() == userNo)
				.findFirst()
				.orElse(null);

		if (foundUser == null) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.headers(headers)
					.body(new ResponseMessage(404, "사용자를 찾을 수 없습니다.", Map.of("userNo", userNo)));
		}
		
		System.out.println(foundUser);
		
		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("user", foundUser);
		
		return ResponseEntity
				.ok()
				.headers(headers)
				.body(new ResponseMessage(200, "조회 성공!", responseMap));
	}

	@PostMapping("/users")
	public ResponseEntity<?> registUser(@RequestBody UserDTO newUser) throws URISyntaxException {
		
		System.out.println(newUser);
		
		int lastUserNo = users.get(users.size() - 1).getNo();
		newUser.setNo(lastUserNo + 1);
		
		users.add(newUser);
		
		return ResponseEntity
				.created(URI.create("/entity/users/" + users.get(users.size() - 1).getNo()))
				.build();
	}

	@PutMapping("/users/{userNo}")
	public ResponseEntity<?> modifyUser(@RequestBody UserDTO modifyInfo, @PathVariable int userNo) throws URISyntaxException {
		
		System.out.println(modifyInfo);
		
		UserDTO foundUser = users.stream()
				.filter(user -> user.getNo() == userNo)
				.findFirst()
				.orElse(null);

		if (foundUser == null) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body(new ResponseMessage(404, "사용자를 찾을 수 없습니다.", Map.of("userNo", userNo)));
		}

		foundUser.setId(modifyInfo.getId());
		foundUser.setPwd(modifyInfo.getPwd());
		foundUser.setName(modifyInfo.getName());
		
		return ResponseEntity
				.created(URI.create("/entity/users/" + userNo))
				.build();
	}

	@DeleteMapping("/users/{userNo}")
	public ResponseEntity<?> removeUser(@PathVariable int userNo) {
		
		UserDTO foundUser = users.stream()
				.filter(user -> user.getNo() == userNo)
				.findFirst()
				.orElse(null);

		if (foundUser == null) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body(new ResponseMessage(404, "사용자를 찾을 수 없습니다.", Map.of("userNo", userNo)));
		}

		users.remove(foundUser);
		
		return ResponseEntity
				.noContent()
				.build();
	}
}
