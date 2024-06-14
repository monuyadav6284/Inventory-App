import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { COMPANY_SERVICE } from 'src/token';

describe('CompanyController', () => {
  let controller: CompanyController;
  const req: any = {
    user: {
      id: '664f367929c598790a849e21',
      username: 'zeel',
      email: 'higoronokansa3@gmail.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: COMPANY_SERVICE,
          useClass: CompanyService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getall', () => {
    it('should return an array of companies', async () => {
      await controller.getAll(req);
    });
  });
});
