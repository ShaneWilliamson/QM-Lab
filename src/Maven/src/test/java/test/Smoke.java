package test;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Smoke{
	private String baseUrl, nodeUrl;
	private StringBuffer verificationErrors = new StringBuffer();
	private WebDriverWait wait;  
	private WebDriver driver;
	
	@Before
	public void setUp() throws Exception {
		baseUrl = "http://cmpt371g3.usask.ca/";
		nodeUrl = "http://localhost:4444/wd/hub";
	}
	
	
	
	@Test
	public void FirefoxTest() throws Exception {
		verificationErrors.append("Firefox:\n");
		
		// Set up to test with Firefox.
		DesiredCapabilities capability = DesiredCapabilities.firefox();
		capability.setBrowserName("firefox");
		
		driver = new RemoteWebDriver(new URL(nodeUrl), capability);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

		Test();
	}
	
	@Test
	public void ChromeTest() throws Exception {
		verificationErrors.append("Chrome:\n");


		DesiredCapabilities capability = DesiredCapabilities.chrome();

		capability.setBrowserName("chrome");
		driver = new RemoteWebDriver(new URL(nodeUrl), capability);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

		Test();
	}

	public void Test() throws Exception {
		wait = new WebDriverWait(driver, 30);
		System.out.println(driver.toString());
		
		// Get the web page and go to it.
		//Thread.sleep(1000);		// Wait for browser to open.
		driver.get(baseUrl + "development/src/Main/");
		final String previousURL = driver.getCurrentUrl();
		
		// Store the current window handle.
		String winHandleBefore = driver.getWindowHandle();

		// Perform the click operation that opens new window.
		WebElement element = driver.findElement(By.id("auth_button"));
		wait.until(ExpectedConditions.visibilityOf(element));

		element.click();

		// Switch to new window opened.
		for(String winHandle : driver.getWindowHandles()){
			driver.switchTo().window(winHandle);
		}

		// Enter email and password, then click sign in.
		// Email and password prompts may be on separate forms.
		try {
			element = driver.findElement(By.id("Email"));
			wait.until(ExpectedConditions.visibilityOf(element));
			element.clear();
			element.sendKeys("cmpt371testingemail");
			element = driver.findElement(By.id("Passwd"));
			wait.until(ExpectedConditions.visibilityOf(element));
			element.clear();
			element.sendKeys("DarthVader!");
			element = driver.findElement(By.id("signIn"));
			wait.until(ExpectedConditions.visibilityOf(element));
			element.click();
		} catch (NoSuchElementException ignored) {
			element = driver.findElement(By.id("next"));
			wait.until(ExpectedConditions.visibilityOf(element));
			element.click();
			element = driver.findElement(By.id("Passwd"));
			wait.until(ExpectedConditions.visibilityOf(element));
			element.clear();
			element.sendKeys("DarthVader!");
			element = driver.findElement(By.id("signIn"));
			wait.until(ExpectedConditions.visibilityOf(element));
			element.click();
		}

		// Go back to the previous window.
		driver.switchTo().window(winHandleBefore);

		// Enter filename.
		element = driver.findElement(By.id("docName"));
		wait.until(ExpectedConditions.visibilityOf(element));
		element.clear();
		element.sendKeys("Test File");
		element = driver.findElement(By.id("docSubmit"));
		wait.until(ExpectedConditions.visibilityOf(element));
		element.click();

		// Assert that the URL has changed and moved to the new page.
		ExpectedCondition<Boolean> e = new ExpectedCondition<Boolean>() {
			public Boolean apply(WebDriver d) {
				assert d.getCurrentUrl() != null;
				return (d.getCurrentUrl() != previousURL);
			}
		};
		wait.until(e);

		int numElements = 0;
		String elementPath;
		String elementName;

		// Create new items.
		// Count number of elements to check that an item was actually created.
		for (int i = 1; i <= 9; i++) {
			elementPath = "//div[@id='objectSelectTabbar']/div/div/div[2]/div/div/div[" + i + "]";
			elementName = driver.findElement(By.xpath(elementPath)).getText();

			driver.findElement(By.xpath(elementPath)).click();
			driver.findElement(By.id("paperView")).click();
			try {
				// When an element is created, there are 2 elements with the classname 'element'.
				assertTrue(driver.findElements(By.className("element")).size() == numElements + 2);
			} catch (Error e2) {
				verificationErrors.append(elementName + " was not created.\n");
			}
			numElements = driver.findElements(By.className("element")).size();
		}

		// Switch to Links tab, and wait for it to finish switching.
		driver.findElement(By.xpath("//div[contains(text(),'Links')]")).click();
		for (int second = 0;; second++) {
			if (second >= 60) fail("timeout");
			try { if ("Flow".equals(driver.findElement(By.cssSelector("div.webix_list_item")).getText())) break; } catch (Exception e2) {}
			Thread.sleep(1000);
		}

		// Repeat test for links.
		numElements = driver.findElements(By.className("link")).size();
		for (int i = 1; i <= 3; i++) {
			elementPath = "//div[@id='objectSelectTabbar']/div/div/div[2]/div/div/div[" + i + "]";
			elementName = driver.findElement(By.xpath(elementPath)).getText();

			driver.findElement(By.xpath(elementPath)).click();
			driver.findElement(By.id("paperView")).click();
			try {
				assertTrue(driver.findElements(By.className("link")).size() == numElements + 2);
			} catch (Error e2) {
				verificationErrors.append(elementName + " was not created.\n");
			}
			numElements = driver.findElements(By.className("link")).size();
		}

		// Check that file was created, then delete it.
		Actions action = new Actions(driver);

		driver.get("http://drive.google.com");
		element = driver.findElement(By.xpath("//span[contains(text(), 'Test File')]"));
		wait.until(ExpectedConditions.elementToBeClickable(element));

		assertTrue(isElementPresent(By.xpath("//*[contains(text(), 'Test File')]")));

		// Right click, then navigate to 'Remove' option.
		//	('Remove' is the 9th option in the context menu)
		action.contextClick(driver.findElement(By.xpath("//*[contains(text(), 'Test File')]")));
		for (int i = 0; i < 9; i++)
			action.sendKeys(Keys.ARROW_DOWN);
		action.sendKeys(Keys.RETURN).build().perform();

		// Wait for file to be deleted.
		Thread.sleep(1000);
		
		verificationErrors.append("Test completed.\n");
	}

	private boolean isElementPresent(By by) {
		try {
			driver.findElement(by);
			return true;
		} catch (NoSuchElementException e) {
			return false;
		}
	}

	@After
	public void tearDown() throws Exception {
		// Close when done. We will move this to a newer spot with more tests
		driver.quit();
		String verificationErrorString = verificationErrors.toString();
		if (!"".equals(verificationErrorString)) {
			System.out.println(verificationErrorString);
		}
	}
}
