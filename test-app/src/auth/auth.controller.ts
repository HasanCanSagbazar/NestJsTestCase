import { Body, Controller, Get, Req, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';
import { AccessTokenGuard } from './guards/accesstoken.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @HttpCode(HttpStatus.OK)
    @Post('/signIn')
    async signIn(@Body() signInDto: SignInDto){
        const user = await this.authService.validateUser(signInDto.identifier, signInDto.password);
        if (user) {
            return this.authService.signIn(signInDto);
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    @Post('/signUp')
    async signUp(@Body() singUpDto: SignUpDto){
        return this.authService.signUp(singUpDto);
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(@Req() req: AuthenticatedRequest) {
        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

      this.authService.logout(req.user.userId, token);
    }
    
}
